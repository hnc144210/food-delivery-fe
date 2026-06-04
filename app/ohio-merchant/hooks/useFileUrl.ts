import { useQuery } from '@tanstack/react-query';
import { fileService } from '@/services/fileService';

export function useFileUrl(fileKey: string | null | undefined) {
  return useQuery({
    queryKey: ['file-url', fileKey],
    queryFn: () => fileService.getReadUrl(fileKey!),
    enabled: Boolean(fileKey),
    staleTime: 10 * 60 * 1000, // URL expire dài, cache 10 phút
    gcTime: 15 * 60 * 1000,
  });
}