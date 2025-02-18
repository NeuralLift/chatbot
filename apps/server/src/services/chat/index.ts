import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { PineconeStore } from '@langchain/pinecone';
import { v4 as uuid } from 'uuid';
import { z } from 'zod';

import { asyncHandler } from '../../middleware/async';
import AppResponse from '../../utils/appResponse';
import { getEmbeddings } from '../../utils/embeddings';
import { getLLM } from '../../utils/llm';
import { loadUrlDocument } from '../../utils/loadDocument';
import { getPineconeIndex } from '../../utils/pinecone';
import { textSplitter } from '../../utils/textSplitter';

const SYSTEM_TEMPLATE = `
You are a Customer Support AI Agent. Your task is to assist customers by answering their inquiries, resolving issues, and providing helpful information in a patient and understanding manner. Always strive to be courteous and provide accurate information to help the customer effectively.
`;

const USER_TEMPLATE = `
Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
Use three sentences minimum and keep the answer as concise as possible.
Always say "thanks for asking!" at the end of the answer.

Context: {context}

Question: {input}

Helpful Answer:`;

const PROMPT_TEMPLATE = ChatPromptTemplate.fromMessages([
  ['system', SYSTEM_TEMPLATE],
  new MessagesPlaceholder('chat_history'),
  ['user', USER_TEMPLATE],
]);

export const createMessage = asyncHandler(async (req, res) => {
  const { question } = bodySchema.parse(req.body);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write('event: start\n');

  const vectorStore = await PineconeStore.fromExistingIndex(getEmbeddings(), {
    pineconeIndex: getPineconeIndex(),
    maxConcurrency: 5,
  });
  const docs = await vectorStore.similaritySearch(question, 3);

  const propmtValue = await PROMPT_TEMPLATE.invoke({
    context: docs.map((doc) => doc.pageContent).join('\n'),
    chat_history: [],
    input: question,
  });

  const stream = await getLLM().stream(propmtValue);

  for await (const chunk of stream) {
    const content = chunk.content;
    console.log(content);
    res.write(`data: ${JSON.stringify({ content })}\n\n`);
  }

  res.write('event: end\n');

  res.end();
});

const bodySchema = z.object({
  question: z.string().min(1),
  chat_history: z
    .array(z.object({ role: z.string(), content: z.string() }))
    .optional(),
  id: z.string().optional(),
});

const fileUrlSchema = z.object({
  fileUrl: z.string().url(),
});

export const storeDocument = asyncHandler(async (req, res) => {
  const { fileUrl } = fileUrlSchema.parse(req.body);
  const docs = await loadUrlDocument(fileUrl);
  const splitDocs = await textSplitter(docs);

  const mapSplitDocs = splitDocs.map((doc) => ({
    pageContent: doc.pageContent,
    metadata: doc.metadata,
  }));

  const mapSplitDocsIds = mapSplitDocs.map(() => uuid());

  const vectorStore = await PineconeStore.fromExistingIndex(getEmbeddings(), {
    pineconeIndex: getPineconeIndex(),
    maxConcurrency: 5,
  });

  const result = await vectorStore.addDocuments(mapSplitDocs, {
    ids: mapSplitDocsIds,
  });

  new AppResponse({
    res,
    data: result,
    message: 'success',
    success: true,
    statusCode: 200,
  });
});
