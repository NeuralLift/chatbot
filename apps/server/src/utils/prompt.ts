/* eslint-disable @typescript-eslint/no-explicit-any */

const SYSTEM_PROMPT = `You are a Customer Support AI Agent. Your task is to assist customers by answering their inquiries, resolving issues, and providing helpful information in a patient and understanding manner. Always strive to be courteous and provide accurate information to help the customer effectively.
`;

const DEFAULT_PROMPT = ``;

const USER_PROMPT = `Use the following context to answer the questions at the end.
If you don't know the answer, just say you don't know.
Answer in **maximum 1 sentences**.

{context}

Helpful Answer: `;

// const DEFAULT_PROMPT = `You are a Customer Support AI Agent. Your task is to assist customers by answering their inquiries, resolving issues, and providing helpful information in a patient and understanding manner. You have access to the following tools:

// - \`Retriever\`: call this tool to retrieve relevant information from the knowledge base.

// Always strive to be courteous and provide accurate information to help the customer effectively.`;

/**
 * Replace placeholders in a string with values from an object.
 *
 * The syntax for placeholders is `{key}`, where `key` is a key in the
 * `values` object. If the key is not present in `values`, the placeholder
 * will be left as is.
 *
 * @param template The string with placeholders to be replaced.
 * @param values The object containing the values to replace the placeholders.
 * @returns The string with all placeholders replaced.
 */
function fillTemplate(template: string, values: Record<string, any>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return values[key] !== undefined ? values[key] : `{${key}}`; // Kalau tidak ada, biarkan placeholder tetap ada
  });
}

/**
 * Merges the system prompt and user prompt into a single string.
 *
 * The system prompt is prepended to the user prompt, separated by a newline.
 *
 * @param defaultPrompt The default prompt to prepend.
 * @param userPrompt The user prompt to append.
 * @returns The merged prompt string.
 */
function mergePrompts(defaultPrompt: string, userPrompt: string): string {
  return defaultPrompt + '\n' + userPrompt;
}

/**
 * Extracts variable names from a prompt string.
 *
 * @param prompt The string to extract variables from.
 * @returns An array of variable names.
 */
function extractVariables(prompt: string): string[] {
  const matches = prompt.match(/{(.*?)}/g) || [];
  return matches.map((m) => m.replace(/[{}]/g, '')); // Hapus `{}` agar hanya dapat nama variabel
}

/**
 * Creates an object with dynamic input data for the AI model.
 *
 * The `variables` parameter is an array of strings, where each string is a
 * variable name in the prompt string. The `requestData` parameter is an object
 * containing the values of the variables. If a variable is not present in the
 * `requestData` object, the value will be set to `Unknown <variable name>`.
 *
 * @param variables The array of variable names to extract from the request data.
 * @param requestData The request data containing the values of the variables.
 * @returns The object with dynamic input data.
 */
function createDynamicInputData<T extends Record<string, unknown>>(
  variables: (keyof T)[],
  requestData: T
): Partial<Record<keyof T, string>> {
  const inputData: Partial<Record<keyof T, string>> = {};

  variables.forEach((variable) => {
    inputData[variable] = String(
      requestData[variable] ?? `Unknown ${String(variable)}`
    );
  });

  return inputData;
}

function extractAndFillVariables<T extends Record<string, unknown>>(
  prompt: string,
  requestData: T
): Partial<Record<keyof T, string>> {
  const matches = prompt.match(/{(.*?)}/g) || [];

  return matches.reduce(
    (acc, match) => {
      const key = match.replace(/[{}]/g, '') as keyof T;
      acc[key] = String(requestData[key] ?? `Unknown ${String(key)}`);
      return acc;
    },
    {} as Partial<Record<keyof T, string>>
  );
}

export {
  DEFAULT_PROMPT,
  SYSTEM_PROMPT,
  USER_PROMPT,
  fillTemplate,
  mergePrompts,
  extractVariables,
  createDynamicInputData,
  extractAndFillVariables,
};
