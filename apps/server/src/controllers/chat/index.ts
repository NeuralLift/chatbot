/* eslint-disable @typescript-eslint/no-explicit-any */
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { IterableReadableStream } from '@langchain/core/utils/stream';
import { Response } from 'express';
import z from 'zod';

import type { CreateMessage } from '../../types/interface/message';
import type { Agent, Prisma } from '@prisma/client';
import { asyncHandler } from '../../middleware/async';
import { getAgentById, updateAgentById } from '../../services/agent';
import {
  createConversation,
  getConversationByChatId,
  getConversationById,
  updateConversationById,
} from '../../services/conversation';
import { createMessage } from '../../services/messages';
import { UpdateAgent } from '../../types/interface/agent';
import { AppError } from '../../utils/appError';
import { graph } from '../../utils/mygraph/cs_graph';
import {
  QUERY_SYSTEM_PROMPT_TEMPLATE,
  RESPONSE_SYSTEM_PROMPT_TEMPLATE,
} from '../../utils/mygraph/cs_graph/prompt';

type MessageEvent = {
  eventData: Record<string, any>;
  eventType: 'messages' | 'values';
  res: Response;
};

const createNewMessageValidator = z.object({
  messages: z.array(
    z.object({ role: z.enum(['human', 'ai']), content: z.string().min(1) })
  ),
  userId: z.string().min(1),
  agentId: z.string().min(1),
  chatId: z.number().min(1).optional().describe('Telegram chat id'),
  conversationId: z.string().min(1).optional(),
});

const createNewMessage = asyncHandler(async (req, res) => {
  const data = createNewMessageValidator.parse(req.body);
  const agent = await getAgentById(data.agentId);
  if (!agent) {
    throw AppError.notFound('Agent not found');
  }

  const messages = data.messages.map((message) =>
    message.role === 'ai'
      ? new AIMessage({ content: message.content })
      : new HumanMessage({ content: message.content })
  );

  const stream = await graph.stream(
    { messages },
    {
      configurable: {
        retrieverProvider: 'pinecone',
        queryModel: `groq/llama-3.3-70b-versatile`,
        responseModel: `groq/${agent.model}`,
        datasourceId: agent.datasources.map(({ datasource }) => datasource.id),
        responseSystemPromptTemplate:
          agent.system_prompt ?? RESPONSE_SYSTEM_PROMPT_TEMPLATE,
        querySystemPromptTemplate: QUERY_SYSTEM_PROMPT_TEMPLATE,
        embeddingModel: 'mistral/mistral-embed',
        searchKwargs: {},
      },
      streamMode: ['messages', 'values'],
    }
  );

  await processStream(stream, res, data, agent);
});

async function processStream(
  stream: IterableReadableStream<any>,
  res: Response,
  data: z.infer<typeof createNewMessageValidator>,
  agent: Prisma.AgentGetPayload<{
    include: {
      datasources: {
        select: {
          datasource: true;
        };
      };
    };
  }>
) {
  const errors: string[] = [];
  let accumulatedContent = '';
  let filteredData: Record<string, string> = {};
  let messagesToStore: CreateMessage[] = [];
  const conversation = await getOrCreateConversation(data, agent);

  setupResponseHeaders(res);

  res.write(
    `\ndata: {"event":"conversationId","data":{"conversationId":"${conversation.id}"}}\n\n`
  );

  for await (const chunk of stream) {
    try {
      const [eventType, eventData] = chunk;
      if (eventType === 'messages') {
        accumulatedContent += handleMessageEvent({ eventData, eventType, res });
      } else if (eventType === 'values') {
        filteredData = handleValueEvent({ eventData, eventType, res });
      }
    } catch (error: any) {
      console.error('Error processing chunk:', error);
      errors.push(error.message);
    }
  }

  finalizeResponse(res, errors);

  if (accumulatedContent.trim()) {
    await updateConversation(conversation.id, filteredData);
    messagesToStore = createMessagesToStore(
      data,
      filteredData,
      conversation.id
    );
    await storeMessages(messagesToStore);
    await updateAgent(agent.id, {
      datasourceIds: agent.datasources.map(({ datasource }) => datasource.id),
      lastActive: new Date().toISOString(),
    });
  }
}

function setupResponseHeaders(res: Response) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.write('event: start\n');
}

function finalizeResponse(res: Response, errors: string[]) {
  if (errors.length > 0) {
    res.write(`data: ${JSON.stringify({ event: 'errors', errors })}\n\n`);
  }
  res.write('event: end\n');
  res.end();
}

function createMessagesToStore(
  data: z.infer<typeof createNewMessageValidator>,
  filteredData: Record<string, string>,
  conversationId: string
): CreateMessage[] {
  return [
    {
      role: 'human',
      content: data.messages[data.messages.length - 1].content,
      conversationId,
    },
    {
      role: 'ai',
      content: filteredData.content,
      conversationId,
    },
  ];
}

async function storeMessages(messages: CreateMessage[]) {
  for (const message of messages) {
    await createMessage(message);
  }
}

const getOrCreateConversation = async (
  data: z.infer<typeof createNewMessageValidator>,
  agent: Agent
) => {
  if (data.conversationId) {
    const conversation = await getConversationById(data.conversationId);
    if (conversation) return conversation;
  } else if (data.chatId) {
    const conversation = await getConversationByChatId(data.chatId);
    if (conversation) return conversation;
  }

  return await createConversation({
    agentId: agent.id,
    userId: data.userId,
    chatId: data.chatId,
    status: 'active',
    category: 'question',
    priority: 'low', // default priority
  });
};

const updateConversation = async (
  conversationId: string,
  filteredData: Record<string, string>
) => {
  return await updateConversationById(conversationId, {
    priority: filteredData.priority as 'low' | 'medium' | 'high',
  });
};

const updateAgent: UpdateAgent = async (agentId, data) => {
  return await updateAgentById(agentId, data);
};

function handleMessageEvent({
  eventData,
  eventType,
  res,
}: MessageEvent): string {
  const json = JSON.stringify(eventData);
  const parsed = JSON.parse(json);

  const isAIMessage = parsed[0]?.id?.includes('AIMessageChunk');

  if (isAIMessage) {
    const content = parsed[0]?.kwargs?.content || '';
    const formattedData = JSON.stringify({
      event: eventType,
      data: { content },
    });

    res.write(`data: ${formattedData}\n\n`);
    return content;
  }

  return '';
}

function handleValueEvent({ eventData, eventType, res }: MessageEvent) {
  const aiMsg = eventData.messages[eventData.messages.length - 1].content;
  const filteredData = {
    content: aiMsg,
    retrievedDocs: eventData.retrievedDocs,
    summary_conversation: eventData.summary_conversation,
    priority: eventData.priority,
    triggerAction: eventData.triggerAction,
    queries: eventData.queries,
  };

  const { content: _, ...restFilteredData } = filteredData;

  const formattedData = JSON.stringify({
    event: eventType,
    data: restFilteredData,
  });

  res.write(`data: ${formattedData}\n\n`);
  return filteredData;
}

export const chatController = {
  createNewMessage,
};
