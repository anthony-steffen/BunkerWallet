import { useLogin } from "@/hooks/useAuth";

export default function Login() {
  const login = useLogin();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;

    login.mutate({ email, password });
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Senha" />
      <button type="submit" disabled={login.isPending}>Entrar</button>
      {login.isError && <p>Erro ao autenticar</p>}
    </form>
  );
}
