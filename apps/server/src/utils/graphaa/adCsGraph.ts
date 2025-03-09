import { RunnableConfig } from '@langchain/core/runnables';
import { StateGraph } from '@langchain/langgraph';

import { ConfigurationAnnotation, ensureConfiguration } from './configuration';
import { makeRetriever } from './retrieval';
import { InputStateAnnotation, StateAnnotation } from './state';
import { formatDocs, getMessageText, loadChatModel } from './utils';

// 🔹 Schema untuk mendeteksi berbagai aksi berdasarkan input user
// const TriggerAction = z.object({
//   action: z.string().describe('The type of action to be performed.'),
//   target: z
//     .string()
//     .optional()
//     .describe('The target for the action, if applicable.'),
//   content: z
//     .string()
//     .optional()
//     .describe('Additional content related to the action.'),
// });

// ✅ Fungsi untuk mendeteksi trigger dalam input user
async function detectTrigger(
  state: typeof StateAnnotation.State,
  _config?: RunnableConfig
): Promise<typeof StateAnnotation.Update> {
  const userMessage = getMessageText(state.messages[state.messages.length - 1]);

  // 🔍 Cek apakah input mengandung trigger tertentu
  if (/buatkan email ke (.+@.+\..+)/i.test(userMessage)) {
    const match = userMessage.match(/buatkan email ke (.+@.+\..+)/i);
    return { triggerAction: { action: 'send_email', target: match?.[1] } };
  }
  if (/buat tiket dengan isi (.+)/i.test(userMessage)) {
    const match = userMessage.match(/buat tiket dengan isi (.+)/i);
    return { triggerAction: { action: 'create_ticket', content: match?.[1] } };
  }
  if (/kirim notifikasi ke (\w+) dengan pesan (.+)/i.test(userMessage)) {
    const match = userMessage.match(
      /kirim notifikasi ke (\w+) dengan pesan (.+)/i
    );
    return {
      triggerAction: {
        action: 'send_notification',
        target: match?.[1],
        content: match?.[2],
      },
    };
  }
  if (/cek status pesanan #(\d+)/i.test(userMessage)) {
    const match = userMessage.match(/cek status pesanan #(\d+)/i);
    return { triggerAction: { action: 'track_order', target: match?.[1] } };
  }
  if (/buat laporan keuangan bulan ini/i.test(userMessage)) {
    return { triggerAction: { action: 'generate_financial_report' } };
  }

  return { triggerAction: null };
}

// ✅ Fungsi untuk mengeksekusi aksi berdasarkan trigger yang terdeteksi
async function executeTrigger(
  state: typeof StateAnnotation.State,
  _config: RunnableConfig
): Promise<typeof StateAnnotation.Update> {
  const trigger = state.triggerAction;

  if (!trigger) return { messages: [] };

  switch (trigger.action) {
    case 'send_email':
      console.log(`📧 Mengirim email ke ${trigger.target}`);
      return {
        messages: [
          {
            role: 'system',
            content: `Email telah dikirim ke ${trigger.target}.`,
          },
        ],
      };

    case 'create_ticket':
      console.log(`🎫 Membuat tiket dengan isi: ${trigger.content}`);
      return {
        messages: [
          {
            role: 'system',
            content: `Tiket telah dibuat dengan isi: "${trigger.content}".`,
          },
        ],
      };

    case 'send_notification':
      console.log(
        `🔔 Mengirim notifikasi ke ${trigger.target}: ${trigger.content}`
      );
      return {
        messages: [
          {
            role: 'system',
            content: `Notifikasi telah dikirim ke ${trigger.target}.`,
          },
        ],
      };

    case 'track_order':
      console.log(`📦 Mengecek status pesanan #${trigger.target}`);
      return {
        messages: [
          {
            role: 'system',
            content: `Status pesanan #${trigger.target}: Sedang diproses.`,
          },
        ],
      };

    case 'generate_financial_report':
      console.log(`📄 Membuat laporan keuangan bulan ini.`);
      return {
        messages: [
          {
            role: 'system',
            content: `Laporan keuangan bulan ini telah dibuat.`,
          },
        ],
      };

    default:
      return {
        messages: [{ role: 'system', content: 'Aksi tidak dikenali.' }],
      };
  }
}

// ✅ AI akan menjawab pertanyaan jika tidak ada trigger yang terdeteksi
async function generateCustomerQuery(
  state: typeof StateAnnotation.State,
  _config?: RunnableConfig
): Promise<typeof StateAnnotation.Update> {
  const messages = state.messages;
  const humanInput = getMessageText(messages[messages.length - 1]);
  return { queries: [humanInput] };
}

// ✅ Fungsi untuk mengambil informasi dari knowledge base
async function retrieveCustomerInfo(
  state: typeof StateAnnotation.State,
  config: RunnableConfig
): Promise<typeof StateAnnotation.Update> {
  const query = state.queries[state.queries.length - 1];
  const retriever = await makeRetriever(config);
  const response = await retriever.invoke(query);
  return { retrievedDocs: response };
}

// ✅ AI akan memberikan jawaban berdasarkan hasil pencarian knowledge base
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

graph.name = 'Advanced Customer Support Graph'; // Nama workflow untuk LangSmith
