// src/pages/Users.tsx
import { useUsers } from "@/hooks/useUsers";

export default function Users() {
  const { data: users, isLoading, error } = useUsers();

  if (isLoading) return <div className="loading loading-spinner"></div>;
  if (error) return <div className="text-red-500">Erro ao carregar usuários</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Usuários</h1>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Criado em</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{new Date(u.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
