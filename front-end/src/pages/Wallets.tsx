import { useState } from "react";
import type { FormEvent } from "react";
import { Plus, Wallet } from "lucide-react";
import LayoutDashboard from "@/components/layout/LayoutDashboard";
import { Header } from "@/components/layout/Header";
import { useCreateWallet, useWallets } from "@/hooks/useWallets";
import { formatCurrency } from "@/utils/format";

export default function Wallets() {
  const { data: wallets = [], isLoading, refetch } = useWallets();
  const createWallet = useCreateWallet();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;

    await createWallet.mutateAsync({
      name: name.trim(),
      description: description.trim() || undefined,
    });
    setName("");
    setDescription("");
  };

  return (
    <LayoutDashboard>
      <Header walletName="Carteiras" onRefresh={refetch} />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">Carteiras</h1>
          <p className="text-sm text-base-content/60">
            Crie e acompanhe suas carteiras de criptoativos.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[360px_1fr]">
          <form onSubmit={handleSubmit} className="glass-panel rounded-lg p-5">
            <h2 className="mb-4 flex items-center gap-2 font-semibold">
              <Plus size={18} /> Nova carteira
            </h2>
            <div className="space-y-3">
              <label className="form-control">
                <span className="label-text mb-1">Nome</span>
                <input
                  className="input input-bordered"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Minha carteira principal"
                  required
                />
              </label>
              <label className="form-control">
                <span className="label-text mb-1">Descricao</span>
                <textarea
                  className="textarea textarea-bordered min-h-24"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Objetivo, exchange ou observacoes"
                />
              </label>
              <button
                className="btn btn-primary w-full"
                disabled={createWallet.isPending}
                type="submit"
              >
                {createWallet.isPending ? "Criando..." : "Criar carteira"}
              </button>
              {createWallet.isError && (
                <p className="text-sm text-error">
                  Nao foi possivel criar a carteira. Verifique se o nome ja existe.
                </p>
              )}
            </div>
          </form>

          <section className="glass-panel rounded-lg p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold">Suas carteiras</h2>
              <span className="text-sm text-base-content/50">
                {wallets.length} cadastrada(s)
              </span>
            </div>

            {isLoading && <p className="text-sm text-base-content/60">Carregando...</p>}

            {!isLoading && wallets.length === 0 && (
              <div className="rounded-lg border border-dashed border-base-300 p-8 text-center">
                <Wallet className="mx-auto mb-3 text-base-content/40" size={34} />
                <p className="font-medium">Nenhuma carteira criada</p>
                <p className="mt-1 text-sm text-base-content/55">
                  Crie uma carteira para habilitar portfolio e transacoes.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {wallets.map((wallet) => (
                <article
                  key={wallet.id}
                  className="rounded-lg border border-base-300/70 bg-base-200/60 p-4"
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{wallet.name}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-base-content/55">
                        {wallet.description || "Sem descricao"}
                      </p>
                    </div>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/12 text-primary">
                      <Wallet size={18} />
                    </div>
                  </div>
                  <div className="flex items-end justify-between text-sm">
                    <span className="text-base-content/50">Saldo estimado</span>
                    <strong>${formatCurrency(wallet.balance ?? 0)}</strong>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </LayoutDashboard>
  );
}
