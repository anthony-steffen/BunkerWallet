import React from "react";

export default function SwapCryptoForm() {
  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-2 text-center">Trocar Cripto</h2>
      <p className="text-sm text-gray-400 text-center">
        Selecione o ativo que deseja trocar e o ativo de destino.
      </p>

      <input
        type="text"
        placeholder="Ativo origem (ex: BTC)"
        className="input input-bordered w-full bg-base-200 text-gray-100"
      />
      <input
        type="text"
        placeholder="Ativo destino (ex: ETH)"
        className="input input-bordered w-full bg-base-200 text-gray-100"
      />
      <input
        type="number"
        placeholder="Quantidade"
        className="input input-bordered w-full bg-base-200 text-gray-100"
      />

      <button className="btn bg-yellow-400 border-none text-black font-semibold">
        Trocar
      </button>
    </div>
  );
}
