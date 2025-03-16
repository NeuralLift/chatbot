import { PlaywrightWebBaseLoader } from '@langchain/community/document_loaders/web/playwright';

export const loadWebDocument = async (url: string) => {
  const loader = new PlaywrightWebBaseLoader(url, {
    gotoOptions: {
      waitUntil: 'domcontentloaded',
    },
    async evaluate(page) {
      const result = await page.evaluate(() => {
        // Remove all <script> elements
        const scripts = document.querySelectorAll('script');
        scripts.forEach((script) => script.remove());

        // Return the text content of the body
        return document.body.textContent || '';
      });
      return result;
    },
  });

  const docs = await loader.load();

  return docs;
};
