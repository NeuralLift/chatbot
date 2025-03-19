import { groq } from '../../utils/groq';

export class ModelService {
  static async getAllModels() {
    try {
      const models = await groq.models.list();
      return models;
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  }
}
