import { CSVLoader } from '@langchain/community/document_loaders/fs/csv';
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx';
import { WebPDFLoader } from '@langchain/community/document_loaders/web/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';

export async function loadUrlDocument(url: string) {
  try {
    const res = await fetch(url);

    const buffer = await res.arrayBuffer();

    const contentType = res.headers.get('Content-Type');

    let loader;
    if (contentType === 'application/pdf') {
      const blob = new Blob([buffer], { type: 'application/pdf' });
      loader = new WebPDFLoader(blob);
    } else if (
      contentType ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const blob = new Blob([buffer], { type: contentType });
      loader = new DocxLoader(blob);
    } else if (contentType === 'text/csv') {
      const blob = new Blob([buffer], { type: 'text/csv' });
      loader = new CSVLoader(blob);
    } else if (contentType === 'text/plain') {
      const blob = new Blob([buffer], { type: 'text/plain' });

      loader = new TextLoader(blob);
    } else {
      throw new Error('Unsupported file type');
    }

    const docs = await loader.load();

    return docs;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
