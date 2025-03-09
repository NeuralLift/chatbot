/* eslint-disable @typescript-eslint/no-explicit-any */
import { AIMessage, HumanMessage } from '@langchain/core/messages';
import { IterableReadableStream } from '@langchain/core/utils/stream';
import { Response } from 'express';
import z from 'zod';

import type { CreateMessage } from '../../types/interface/message';
import type { Agent } from '@prisma/client';
import { asyncHandler } from '../../middleware/async';
import { getAgentById } from '../../services/agent';
import {
  createConversation,
  getConversationById,
} from '../../services/conversation';
import { createMessage } from '../../services/messages';
import { AppError } from '../../utils/appError';
import { graph } from '../../utils/mygraph/cs_graph';
import {
  QUERY_SYSTEM_PROMPT_TEMPLATE,
  RESPONSE_SYSTEM_PROMPT_TEMPLATE,
} from '../../utils/mygraph/cs_graph/prompt';

const createNewMessage = asyncHandler(async (req, res) => {
  const data = createNewMessageValidator.parse(req.body);

  const agent = await getAgentById(data.agentId);
  if (!agent) {
    throw AppError.notFound('Agent not found');
  }

  const messages = data.messages.map((message) => {
    return message.role === 'ai'
      ? new AIMessage({ content: message.content })
      : new HumanMessage({ content: message.content });
  });

  const stream = await graph.stream(
    { messages },
    {
      configurable: {
        retrieverProvider: 'pinecone',
        queryModel: 'groq/qwen-2.5-32b',
        responseModel: 'groq/qwen-2.5-32b',
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
  agent: Agent
) {
  const errors: string[] = [];
  let accumulatedContent = '';
  let filteredData: Record<string, string> = {};
  let messagesToStore: CreateMessage[] = [];

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.write('event: start\n');

  for await (const chunk of stream) {
    try {
      const [eventType, eventData] = chunk;

      if (eventType === 'messages') {
        accumulatedContent += handleMessageEvent({ eventData, eventType, res });
      }

      if (eventType === 'values') {
        filteredData = handleValueEvent({ eventData, eventType, res });
      }
    } catch (error: any) {
      console.error('Error processing chunk:', error);
      errors.push(error.message);
    }
  }

  if (errors.length > 0) {
    res.write(`data: ${JSON.stringify({ event: 'errors', errors })}\n\n`);
  }

  res.write('event: end\n');
  res.end();

  if (accumulatedContent.trim()) {
    let conversation = await getConversationById(data.conversationId);

    if (!conversation) {
      conversation = await createConversation({
        agentId: agent.id,
        userId: data.userId,
        status: 'active',
        category: 'question',
        priority: filteredData.priority as 'low' | 'medium' | 'high',
      });
    }

    messagesToStore = [
      {
        role: 'human',
        content: data.messages[data.messages.length - 1].content,
        conversationId: conversation.id,
      },
      {
        role: 'ai',
        content: filteredData.content,
        conversationId: conversation.id,
      },
    ];

    // await Promise.all(
    //   messagesToStore.map(async (message) => {
    //     await createMessage(message);
    //   })
    // );
    for (const message of messagesToStore) {
      await createMessage(message);
    }
  }
}

type MessageEvent = {
  eventData: Record<string, any>;
  eventType: 'messages' | 'values';
  res: Response;
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

const createNewMessageValidator = z.object({
  messages: z.array(
    z.object({ role: z.enum(['human', 'ai']), content: z.string().min(1) })
  ),
  userId: z.string().min(1),
  agentId: z.string().min(1),
  conversationId: z.string().min(1).optional(),
});

export const chatController = {
  createNewMessage,
};
