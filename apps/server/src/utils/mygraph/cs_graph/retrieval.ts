// import { Client } from "@elastic/elasticsearch";
// import { ElasticVectorSearch } from '@langchain/community/vectorstores/elasticsearch';
import { Embeddings } from '@langchain/core/embeddings';
import { RunnableConfig } from '@langchain/core/runnables';
import { VectorStoreRetriever } from '@langchain/core/vectorstores';
// import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { PineconeStore } from '@langchain/pinecone';

import { getEmbeddings } from '../../embeddings';
import { getPineconeIndex } from '../../pinecone';
// import { MongoClient } from "mongodb";
import { ensureConfiguration } from './configuration';

// import { CohereEmbeddings } from "@langchain/cohere";
// import { OpenAIEmbeddings } from "@langchain/openai";

// async function makeElasticRetriever(
//   configuration: ReturnType<typeof ensureConfiguration>,
//   embeddingModel: Embeddings
// ): Promise<VectorStoreRetriever> {
//   const elasticUrl = process.env.ELASTICSEARCH_URL;
//   if (!elasticUrl) {
//     throw new Error('ELASTICSEARCH_URL environment variable is not defined');
//   }

//   let auth: { username: string; password: string } | { apiKey: string };
//   if (configuration.retrieverProvider === 'elastic-local') {
//     const username = process.env.ELASTICSEARCH_USER;
//     const password = process.env.ELASTICSEARCH_PASSWORD;
//     if (!username || !password) {
//       throw new Error(
//         'ELASTICSEARCH_USER or ELASTICSEARCH_PASSWORD environment variable is not defined'
//       );
//     }
//     auth = { username, password };
//   } else {
//     const apiKey = process.env.ELASTICSEARCH_API_KEY;
//     if (!apiKey) {
//       throw new Error(
//         'ELASTICSEARCH_API_KEY environment variable is not defined'
//       );
//     }
//     auth = { apiKey };
//   }

//   const client = new Client({
//     node: elasticUrl,
//     auth,
//   });

//   const vectorStore = new ElasticVectorSearch(embeddingModel, {
//     client,
//     indexName: 'langchain_index',
//   });
//   const searchKwargs = configuration.searchKwargs || {};
//   const filter = {
//     ...searchKwargs,
//     user_id: configuration.userId,
//   };

//   return vectorStore.asRetriever({ filter });
// }

async function makePineconeRetriever(
  configuration: ReturnType<typeof ensureConfiguration>,
  embeddingModel: Embeddings
): Promise<VectorStoreRetriever> {
  const pineconeIndex = getPineconeIndex();
  const vectorStore = await PineconeStore.fromExistingIndex(embeddingModel, {
    pineconeIndex,
  });

  const searchKwargs = configuration.searchKwargs || {};
  const filter = {
    ...searchKwargs,
    datasourceId: { $in: configuration.datasourceId }, // Use $in operator for multiple datasourceId values
  };

  return vectorStore.asRetriever({
    filter,
    k: 4,
    searchType: 'similarity',
  });
}

// async function makeMongoDBRetriever(
//   configuration: ReturnType<typeof ensureConfiguration>,
//   embeddingModel: Embeddings
// ): Promise<VectorStoreRetriever> {
//   if (!process.env.MONGODB_URI) {
//     throw new Error('MONGODB_URI environment variable is not defined');
//   }
//   const client = new MongoClient(process.env.MONGODB_URI);
//   const namespace = `langgraph_retrieval_agent.${configuration.userId}`;
//   const [dbName, collectionName] = namespace.split('.');
//   const collection = client.db(dbName).collection(collectionName);
//   const vectorStore = new MongoDBAtlasVectorSearch(embeddingModel, {
//     collection: collection,
//     textKey: 'text',
//     embeddingKey: 'embedding',
//     indexName: 'vector_index',
//   });
//   const searchKwargs = { ...configuration.searchKwargs };
//   searchKwargs.preFilter = {
//     ...searchKwargs.preFilter,
//     user_id: { $eq: configuration.userId },
//   };
//   return vectorStore.asRetriever({ filter: searchKwargs });
// }

function makeTextEmbeddings(_modelName: string): Embeddings {
  /**
   * Connect to the configured text encoder.
   */
  //   const index = modelName.indexOf('/');
  //   let provider, model;
  //   if (index === -1) {
  //     model = modelName;
  //     provider = 'openai'; // Assume openai if no provider included
  //   } else {
  //     provider = modelName.slice(0, index);
  //     model = modelName.slice(index + 1);
  //   }
  //   switch (provider) {
  //     case 'openai':
  //       return new OpenAIEmbeddings({ model });
  //     case 'cohere':
  //       return new CohereEmbeddings({ model });
  //     default:
  //       throw new Error(`Unsupported embedding provider: ${provider}`);
  //   }
  return getEmbeddings();
}

export async function makeRetriever(
  config: RunnableConfig
): Promise<VectorStoreRetriever> {
  const configuration = ensureConfiguration(config);
  const embeddingModel = makeTextEmbeddings(configuration.embeddingModel);

  const userId = configuration.datasourceId;
  if (!userId) {
    throw new Error('Please provide a valid user_id in the configuration.');
  }

  switch (configuration.retrieverProvider) {
    // case 'elastic':
    // case 'elastic-local':
    //   return makeElasticRetriever(configuration, embeddingModel);
    case 'pinecone':
      return makePineconeRetriever(configuration, embeddingModel);
    // case 'mongodb':
    //   return makeMongoDBRetriever(configuration, embeddingModel);
    default:
      throw new Error(
        `Unrecognized retrieverProvider in configuration: ${configuration.retrieverProvider}`
      );
  }
}
