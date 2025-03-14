import { groq } from '../../utils/groq';

export const getAllGroqModels = async () => {
  try {
    const models = await groq.models.list();

    return models;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
