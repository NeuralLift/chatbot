import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { RunnableConfig } from '@langchain/core/runnables';
import { END, START, StateGraph } from '@langchain/langgraph';
import { z } from 'zod';

import { ConfigurationAnnotation, ensureConfiguration } from './configuration';
import { makeRetriever } from './retrieval';
import { InputStateAnnotation, StateAnnotation } from './state';
import { formatDocs, loadChatModel } from './utils';

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

const ConversationSummary = z.object({
  summary: z
    .string()
    .describe('A clear and concise summary of the conversation.'),
  priority: z
    .enum(['low', 'medium', 'high'])
    .describe('The priority level of the conversation.'),
});

const searchQuery = z.object({
  query: z
    .string()
    .nullable()
    .optional()
    .describe('Search the indexed documents for a query. if needed'),
});

async function detectTrigger(
  _state: typeof StateAnnotation.State,
  _config?: RunnableConfig
): Promise<typeof StateAnnotation.Update> {
  // const userMessage = getMessageText(state.messages[state.messages.length - 1]);

  /**
   * You can add your own trigger detection logic here.
   */

  return { triggerAction: null };
}

async function executeTrigger(
  state: typeof StateAnnotation.State,
  _config: RunnableConfig
): Promise<typeof StateAnnotation.Update> {
  const trigger = state.triggerAction;

  if (!trigger) return { messages: [...state.messages] };

  return {
    messages: [...state.messages],
  };
}

async function generateSummaryConversation(
  state: typeof StateAnnotation.State,
  config?: RunnableConfig
): Promise<typeof StateAnnotation.Update> {
  const messages = state.messages.slice(-9, -1);

  const prompt = `Summarize the following customer support conversation and determine its priority (low, medium, high):

${messages.map((msg) => `${msg.getType()}: ${msg.content}`).join('\n')}

Provide a structured response with both the summary and priority classification.`;

  const configuration = ensureConfiguration(config);
  const model = (
    await loadChatModel(configuration.queryModel)
  ).withStructuredOutput(ConversationSummary);
  const response = await model.invoke(prompt);

  return {
    summary_conversation: response.summary,
    priority: response.priority,
  };
}

async function generateCustomerQuery(
  state: typeof StateAnnotation.State,
  config?: RunnableConfig
): Promise<typeof StateAnnotation.Update> {
  const messages = state.messages;
  const configuration = ensureConfiguration(config);
  const model = (
    await loadChatModel(configuration.queryModel)
  ).withStructuredOutput(searchQuery);
  const prompt = `Generate a search query to help answer the user's question. If not related to questions, leave it {query: null}.
message: ${messages[messages.length - 1].content}`;
  const response = await model.invoke(prompt);
  // const humanInput = getMessageText(messages[messages.length - 1]);
  return { queries: response.query ? [response.query] : [] };
}

async function retrieveCustomerInfo(
  state: typeof StateAnnotation.State,
  config: RunnableConfig
): Promise<typeof StateAnnotation.Update> {
  const query = state.queries[state.queries.length - 1];

  if (!query) return { retrievedDocs: [] };

  const retriever = await makeRetriever(config);
  const response = await retriever.invoke(query);
  return { retrievedDocs: response };
}

async function respondToCustomer(
  state: typeof StateAnnotation.State,
  config: RunnableConfig
): Promise<typeof StateAnnotation.Update> {
  const configuration = ensureConfiguration(config);
  const model = await loadChatModel(configuration.responseModel);

  const retrievedDocs = formatDocs(state.retrievedDocs);
  const systemMessage = configuration.responseSystemPromptTemplate
    // .replace('{summary_conversation}', state.summary_conversation)
    // .replace('{retrievedDocs}', retrievedDocs)
    .replace('{systemTime}', new Date().toISOString());

  const messageValue = [
    new SystemMessage(systemMessage),
    new SystemMessage(state.summary_conversation),
    new SystemMessage(retrievedDocs),
    new HumanMessage(state.messages[state.messages.length - 1]),
  ];
  const response = await model.invoke(messageValue);

  return { messages: [response] };
}

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
  .addNode('generateSummaryConversation', generateSummaryConversation)
  .addNode('respondToCustomer', respondToCustomer)
  .addEdge(START, 'detectTrigger')
  .addEdge('detectTrigger', 'executeTrigger')
  .addEdge('executeTrigger', 'generateCustomerQuery')
  .addEdge('generateCustomerQuery', 'retrieveCustomerInfo')
  .addEdge('retrieveCustomerInfo', 'generateSummaryConversation')
  .addEdge('generateSummaryConversation', 'respondToCustomer')
  .addEdge('respondToCustomer', END);

export const graph = builder.compile({
  interruptBefore: [],
  interruptAfter: [],
});

graph.name = 'Customer Support Graph';
