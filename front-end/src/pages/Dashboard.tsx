import { useCurrentUser } from "@/hooks/useAuth";

export default function Dashboard() {
  <div>Dashboard</div>
  const { data: user } = useCurrentUser();
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Olá {user?.name}</p>
    </div>
  ); 
}
