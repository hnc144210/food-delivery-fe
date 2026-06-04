import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUsers, deleteUser } from '@/services/userService'

export function useUsers(pageIndex = 0, pageSize = 20) {
  return useQuery({
    queryKey: ['users', pageIndex, pageSize],
    queryFn: () => getUsers({ PageIndex: pageIndex, PageSize: pageSize }),
    staleTime: 30_000,
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}