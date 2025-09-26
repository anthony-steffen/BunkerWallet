import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/api";
import { User } from "@/types/User";

// 🔹 GET /users → lista todos os usuários
async function fetchUsers(): Promise<User[]> {
  const { data } = await api.get<User[]>("/users");
  return data;
}

// 🔹 GET /users/:id → busca usuário específico
async function fetchUserById(id: number): Promise<User> {
  const { data } = await api.get<User>(`/users/${id}`);
  return data;
}

// 🔹 POST /users → cria novo usuário
async function createUser(user: Partial<User>): Promise<User> {
  const { data } = await api.post<User>("/users", user);
  return data;
}

// 🔹 PUT /users/:id → atualiza usuário
async function updateUser(id: number, user: Partial<User>): Promise<User> {
  const { data } = await api.put<User>(`/users/${id}`, user);
  return data;
}

// 🔹 DELETE /users/:id → remove usuário
async function deleteUser(id: number): Promise<void> {
  await api.delete(`/users/${id}`);
}

// ----------------------
// 🔹 HOOKS
// ----------------------

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });
}

export function useUser(id: number) {
  return useQuery<User>({
    queryKey: ["users", id],
    queryFn: () => fetchUserById(id),
    enabled: !!id, // só roda se tiver id
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, user }: { id: number; user: Partial<User> }) =>
      updateUser(id, user),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users", id] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
