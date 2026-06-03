import { authApi } from '@/lib/api'

export async function getUploadUrl(fileName: string, contentType: string) {
  const { data } = await authApi.get('http://localhost:8087/api/Files/get-upload-url', {
    params: { fileName, contentType },
  })
  return data.data as { uploadUrl: string; fileKey: string; contentType: string }
}

export async function uploadFile(uploadUrl: string, file: File) {
  await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })
}

export async function getReadUrl(fileKey: string) {
  const { data } = await authApi.get('http://localhost:8087/api/Files/get-read-url', {
    params: { fileKey },
  })
  return data.data as { readUrl: string; fileKey: string; expiresInSeconds: string }
}

export async function uploadAndGetKey(file: File): Promise<string> {
  const { uploadUrl, fileKey } = await getUploadUrl(file.name, file.type)
  await uploadFile(uploadUrl, file)
  return fileKey
}