import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/api";
import { User } from "@/types/User";

async function fetchCurrentUser(): Promise<User> {
  const { data } = await api.get<User>("/auth/me");
  return data;
}

export default function PrivateRoute() {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["user"],
    queryFn: fetchCurrentUser,
    retry: false,
  });

  if (isLoading) return <p>Carregando...</p>;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
