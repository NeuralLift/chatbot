import { ChatGroq } from '@langchain/groq';

export function getLLM() {
  const llm = new ChatGroq({
    model: 'llama-3.3-70b-versatile',
    temperature: 0,
  });

  return llm;
}
