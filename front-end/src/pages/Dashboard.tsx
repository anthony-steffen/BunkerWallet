import { useCurrentUser } from "@/hooks/useAuth";

export default function Dashboard() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return <p>Carregando...</p>;
  return <h1>Bem-vindo, {user?.name}</h1>;
}
