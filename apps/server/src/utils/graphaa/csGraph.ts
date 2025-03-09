import { RunnableConfig } from '@langchain/core/runnables';
import { StateGraph } from '@langchain/langgraph';

import { ConfigurationAnnotation, ensureConfiguration } from './configuration';
import { makeRetriever } from './retrieval';
import { InputStateAnnotation, StateAnnotation } from './state';
import { formatDocs, getMessageText, loadChatModel } from './utils';

// 🔹 Schema untuk mendeteksi aksi yang perlu dijalankan
// const TriggerAction = z.object({
//   action: z.string().describe('Action to perform based on user input.'),
//   target: z
//     .string()
//     .optional()
//     .describe('Target of the action, such as an email address.'),
// });

// ✅ Fungsi untuk mendeteksi apakah input pengguna adalah sebuah trigger
async function detectTrigger(
  state: typeof StateAnnotation.State,
  _config?: RunnableConfig
): Promise<typeof StateAnnotation.Update> {
  const userMessage = getMessageText(state.messages[state.messages.length - 1]);

  // Cek apakah input adalah perintah untuk mengirim email
  if (/buatkan email ke (.+@.+\..+)/i.test(userMessage)) {
    const match = userMessage.match(/buatkan email ke (.+@.+\..+)/i);
    return { triggerAction: { action: 'send_email', target: match?.[1] } };
  }

  return { triggerAction: null };
}

// ✅ Fungsi untuk mengeksekusi aksi berdasarkan trigger
async function executeTrigger(
  state: typeof StateAnnotation.State,
  _config: RunnableConfig
): Promise<typeof StateAnnotation.Update> {
  const trigger = state.triggerAction;

  if (trigger?.action === 'send_email' && trigger.target) {
    console.log(`📧 Mengirim email ke ${trigger.target}`);
    // Panggil API email di sini (misalnya, menggunakan Nodemailer atau SendGrid)
    return {
      messages: [
        {
          role: 'system',
          content: `Email telah dikirim ke ${trigger.target}.`,
        },
      ],
    };
  }

  return { messages: [] };
}

// ✅ Fungsi untuk memproses pertanyaan pelanggan jika tidak ada trigger
async function generateCustomerQuery(
  state: typeof StateAnnotation.State,
  _config?: RunnableConfig
): Promise<typeof StateAnnotation.Update> {
  const messages = state.messages;
  const humanInput = getMessageText(messages[messages.length - 1]);
  return { queries: [humanInput] };
}

// ✅ Fungsi untuk mengambil informasi yang relevan dari knowledge base
async function retrieveCustomerInfo(
  state: typeof StateAnnotation.State,
  config: RunnableConfig
): Promise<typeof StateAnnotation.Update> {
  const query = state.queries[state.queries.length - 1];
  const retriever = await makeRetriever(config);
  const response = await retriever.invoke(query);
  return { retrievedDocs: response };
}

// ✅ Fungsi untuk AI menjawab pertanyaan pelanggan
async function respondToCustomer(
  state: typeof StateAnnotation.State,
  config: RunnableConfig
): Promise<typeof StateAnnotation.Update> {
  const configuration = ensureConfiguration(config);
  const model = await loadChatModel(configuration.responseModel);

  const retrievedDocs = formatDocs(state.retrievedDocs);
  const systemMessage = configuration.responseSystemPromptTemplate
    .replace('{retrievedDocs}', retrievedDocs)
    .replace('{systemTime}', new Date().toISOString());

  const messageValue = [
    { role: 'system', content: systemMessage },
    ...state.messages,
  ];
  const response = await model.invoke(messageValue);
  return { messages: [response] };
}

// 🔹 Membangun workflow LangGraph
const builder = new StateGraph(
  {
    stateSchema: StateAnnotation,
    input: InputStateAnnotation,
  },
  ConfigurationAnnotation
)
  .addNode('detectTrigger', detectTrigger)
  .addNode('executeTrigger', executeTrigger)
  .addNode('generateCustomerQuery', generateCustomerQuery)
  .addNode('retrieveCustomerInfo', retrieveCustomerInfo)
  .addNode('respondToCustomer', respondToCustomer)
  .addEdge('__start__', 'detectTrigger')
  .addEdge('detectTrigger', 'executeTrigger')
  .addEdge('executeTrigger', 'generateCustomerQuery')
  .addEdge('generateCustomerQuery', 'retrieveCustomerInfo')
  .addEdge('retrieveCustomerInfo', 'respondToCustomer');

// 🔹 Compile workflow
export const graph = builder.compile({
  interruptBefore: [],
  interruptAfter: [],
});

graph.name = 'Customer Support Graph'; // Nama workflow untuk LangSmith
