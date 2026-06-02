//hooks/useUsers.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/userService';
import type {
  CreateUserAddressRequest,
  PageParams,
  UpdateUserAddressRequest,
  UpdateUserProfileRequest,
} from '@/types/api';

const LIST_STALE_TIME = 30 * 1000;

export function useUsers(params?: PageParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userService.getUsers(params),
    staleTime: LIST_STALE_TIME,
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => userService.getUser(id),
    enabled: Boolean(id),
    staleTime: LIST_STALE_TIME,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateUserProfileRequest }) =>
      userService.updateUser(id, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}

export function useUserAddresses(id: string, params?: PageParams) {
  return useQuery({
    queryKey: ['users', id, 'addresses', params],
    queryFn: () => userService.getUserAddresses(id, params),
    enabled: Boolean(id),
    staleTime: LIST_STALE_TIME,
  });
}

export function useCreateUserAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: CreateUserAddressRequest }) =>
      userService.createUserAddress(id, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', variables.id, 'addresses'] });
    },
  });
}

export function useUpdateUserAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      addressId,
      body,
    }: {
      id: string;
      addressId: string;
      body: UpdateUserAddressRequest;
    }) => userService.updateUserAddress(id, addressId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', variables.id, 'addresses'] });
    },
  });
}

export function useDeleteUserAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, addressId }: { id: string; addressId: string }) =>
      userService.deleteUserAddress(id, addressId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', variables.id, 'addresses'] });
    },
  });
}