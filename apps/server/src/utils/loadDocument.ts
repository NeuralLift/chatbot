import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf';

export async function loadUrlDocument(url: string) {
  try {
    const res = await fetch(url);

    const buffer = await res.arrayBuffer();

    const blob = new Blob([buffer], { type: 'application/pdf' });

    const loader = new WebPDFLoader(blob);

    const docs = await loader.load();

    return docs;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
