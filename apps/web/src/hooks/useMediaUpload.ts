import { useState } from 'react';
import { toast } from 'sonner';

import { useUploadThing } from '@/lib/uploadthing';

export interface Attachment {
  file: File;
  url?: string;
  // mediaId?: string;
  isUploading: boolean;
}

export function useMediaUpload() {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { isUploading, startUpload } = useUploadThing('documentUploader', {
    onUploadProgress: (progress) => setUploadProgress(progress),
    onBeforeUploadBegin: (files) => {
      const renamedFiles = files.map((file) => {
        const extension = file.name.split('.').pop();

        return new File([file], `${Date.now()}_document.${extension}`);
      });

      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((f) => ({
          file: f,
          isUploading: true,
        })),
      ]);

      return renamedFiles;
    },
    onClientUploadComplete: async (res) => {
      setAttachments((prev) =>
        prev.map((a) => {
          const uploadResult = res.find((r) => r.name === a.file.name);

          if (uploadResult) {
            return {
              ...a,
              url: uploadResult.ufsUrl,
            };
          }

          return {
            ...a,
            isUploading: false,
          };
        })
      );
    },
    onUploadError(e) {
      setAttachments((prev) => prev.filter((a) => !a.isUploading));
      toast.error(e.message);
    },
  });

  function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast.error('Please wait for the current upload to finish.');
      return;
    }

    /// max files upload 5
    if (attachments.length + files.length > 5) {
      toast.error('You can only upload up to 5 attachments per post.');
      return;
    }

    startUpload(files);
  }

  function removeAttachment(fileName: string) {
    setAttachments((prev) => prev.filter((a) => a.file.name !== fileName));
  }

  function reset() {
    setAttachments([]);
    setUploadProgress(0);
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset,
  };
}
