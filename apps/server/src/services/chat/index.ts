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

// export const createMessage2 = asyncHandler(async (req, res) => {
//   const question = req.body.question;

//   const getWeather = tool(
//     (input) => {
//       if (['sf', 'san francisco'].includes(input.location.toLowerCase())) {
//         return "It's 60 degrees and foggy.";
//       } else {
//         return "It's 90 degrees and sunny.";
//       }
//     },
//     {
//       name: 'get_weather',
//       description: 'Call to get the current weather.',
//       schema: z.object({
//         location: z.string().describe('Location to get the weather for.'),
//       }),
//     }
//   );

//   const getDocumentContext = tool(
//     async (input) => {
//       const vectorStore = await PineconeStore.fromExistingIndex(
//         getEmbeddings(),
//         {
//           pineconeIndex: getPineconeIndex(),
//           maxConcurrency: 5,
//         }
//       );

//       console.log(input);
//       const docs = await vectorStore.similaritySearch(input, 3);

//       return docs.map((doc) => doc.pageContent).join('\n');
//     },
//     {
//       name: 'get_document_context',
//       description: 'Call to get the document context.',
//       schema: z.string().describe('The input to search for.'),
//     }
//   );

//   const tools = [getWeather];
//   const modelWithTools = getLLM().bindTools(tools);

//   const toolNodeForGraph = new ToolNode(tools);

//   const shouldContinue = (state: typeof MessagesAnnotation.State) => {
//     const { messages } = state;
//     const lastMessage = messages[messages.length - 1];

//     if (
//       'tool_calls' in lastMessage &&
//       Array.isArray(lastMessage.tool_calls) &&
//       lastMessage.tool_calls?.length
//     ) {
//       return 'tools';
//     }
//     return '__end__';
//   };

//   const callModel = async (state: typeof MessagesAnnotation.State) => {
//     const { messages } = state;
//     const response = await modelWithTools.invoke(messages);
//     return { messages: response };
//   };

//   const graph = new StateGraph(MessagesAnnotation)
//     .addNode('agent', callModel)
//     .addNode('tools', toolNodeForGraph)
//     .addEdge('__start__', 'agent')
//     .addConditionalEdges('agent', shouldContinue)
//     .addEdge('tools', 'agent')
//     .compile();

//   // const stream = await graph.stream(
//   //   {
//   //     messages: [new HumanMessage({ content: question })],
//   //   },
//   //   {
//   //     streamMode: 'messages',
//   //   }
//   // );

//   const prompt = ChatPromptTemplate.fromMessages([
//     [
//       'system',
//       'You are a helpful assistant, jika ada yang minta booking alihkan ke human agent',
//     ],
//     ['placeholder', '{chat_history}'],
//     ['human', '{input}'],
//     ['placeholder', '{agent_scratchpad}'],
//   ]);

//   const agent = await createToolCallingAgent({
//     llm: getLLM(),
//     tools,
//     prompt,
//   });

//   const agentExecutor = new AgentExecutor({
//     agent,
//     tools,
//   });

//   const ww = await graph.stream({
//     messages: [new HumanMessage({ content: question })],
//   });

//   for await (const chunk of ww) {
//     console.log(chunk);
//   }

//   new AppResponse({
//     res,
//     message: 'success',
//     data: ww,
//     success: true,
//     statusCode: 200,
//   });
// });

// export const createMessage2 = asyncHandler(async (req, res) => {
//   const question = req.body.question;

//   // **Schema untuk analisis teks**
//   const analysisSchema = z.object({
//     text: z
//       .string()
//       .min(1, 'Input tidak boleh kosong')
//       .describe('Teks yang akan dianalisis.'),
//     category: z
//       .enum(['question', 'statement', 'command', 'other'])
//       .describe('Kategori dari teks input.'),
//   });

//   // **Instance LLM dengan structured output**
//   const structuredLlm = getLLM().withStructuredOutput(analysisSchema);

//   // **State Annotations**
//   const InputStateAnnotation = Annotation.Root({
//     question: Annotation<string>,
//   });

//   const StateAnnotationQA = Annotation.Root({
//     question: Annotation<string>,
//     category: Annotation<z.infer<typeof analysisSchema>>,
//     context: Annotation<Document[] | null>,
//     answer: Annotation<string>,
//   });

//   // **Fungsi untuk Analisis Query**
//   const analyzeQuery = async (state: typeof InputStateAnnotation.State) => {
//     const result = await structuredLlm.invoke(state.question);
//     return { category: result.category };
//   };

//   // **Fungsi untuk Query jika kategori adalah "question"**
//   const retrieveQA = async (state: typeof StateAnnotationQA.State) => {
//     if (state.category !== 'question') return { context: null }; // Tidak perlu pencarian

//     const vectorStore = await PineconeStore.fromExistingIndex(getEmbeddings(), {
//       pineconeIndex: getPineconeIndex(),
//       maxConcurrency: 5,
//     });
//     const docs = await vectorStore.similaritySearch(state.question, 3);
//     return { context: docs };
//   };

//   // **Fungsi untuk Menjawab**
//   const generateQA = async (state: typeof StateAnnotationQA.State) => {
//     if (state.category === 'statement') {
//       return { answer: 'Terima kasih atas informasinya!' };
//     }

//     if (state.category === 'command') {
//       return { answer: 'Saya akan mencoba menjalankan perintah ini!' };
//     }

//     if (state.category === 'question' && state.context) {
//       const docsContent = state.context
//         .map((doc) => doc.pageContent)
//         .join('\n');

//       const promptTemplate = ChatPromptTemplate.fromMessages([
//         ['system', SYSTEM_TEMPLATE],
//         ['placeholder', '{chat_history}'],
//         ['placeholder', '{context}'],
//         ['user', `{question}`],
//       ]);

//       const messages = await promptTemplate.invoke({
//         question: state.question,
//         context: docsContent,
//       });

//       const response = await getLLM().invoke(messages);
//       return { answer: response.content };
//     }

//     return { answer: 'Saya tidak mengerti apa yang Anda maksud.' };
//   };

//   // **Membuat StateGraph Dinamis**
//   const graphQA = new StateGraph(StateAnnotationQA)
//     .addNode('analyzeQuery', analyzeQuery)
//     .addNode('retrieveQA', retrieveQA)
//     .addNode('generateQA', generateQA)
//     .addEdge('__start__', 'analyzeQuery')
//     .addConditionalEdges(
//       'analyzeQuery',
//       'retrieveQA',
//       (state) => state.category === 'question'
//     )
//     .addEdge('retrieveQA', 'generateQA')
//     .addConditionalEdges(
//       'analyzeQuery',
//       'generateQA',
//       (state) => state.category !== 'question'
//     )
//     .addEdge('generateQA', '__end__')
//     .compile();

//   // **Jalankan StateGraph**
//   const stream = await graphQA.stream({ question });

//   const messages = [];
//   for await (const chunk of stream) {
//     console.log(chunk);
//     messages.push(chunk);
//   }

//   new AppResponse({
//     res,
//     message: 'success',
//     data: messages,
//     success: true,
//     statusCode: 200,
//   });
// });

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
