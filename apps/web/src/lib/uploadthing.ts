import { generateReactHelpers } from '@uploadthing/react';

export const { useUploadThing } = generateReactHelpers({
  url: `/api/v1/uploadthing`,
});
