import { filesApi, extractData } from '@/lib/api';

interface UploadUrlResponse {
  uploadUrl: string;
  fileKey: string;
  contentType: string;
}

interface ReadUrlResponse {
  readUrl: string;
  fileKey: string;
  expiresInSeconds: string;
}

export const fileService = {
  async getUploadUrl(fileName: string, contentType: string): Promise<UploadUrlResponse> {
    const res = await filesApi.get('/api/Files/get-upload-url', {
      params: { fileName, contentType },
    });
    return extractData<UploadUrlResponse>(res);
  },

  async getReadUrl(fileKey: string): Promise<string> {
    const res = await filesApi.get('/api/Files/get-read-url', {
      params: { fileKey },
    });
    const data = extractData<ReadUrlResponse>(res);
    return data.readUrl;
  },

  async uploadFile(uploadUrl: string, uri: string, contentType: string): Promise<void> {
    const blob = await fetch(uri).then((r) => r.blob());
    await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: blob,
    });
  },
};