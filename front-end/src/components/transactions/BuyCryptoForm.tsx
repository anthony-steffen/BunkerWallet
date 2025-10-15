import React from "react";

export default function BuyCryptoForm() {
  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-2  text-center">Comprar Cripto</h2>
      <p className="text-sm text-gray-400 text-center">
        Selecione o ativo e o valor que deseja comprar.
      </p>

      <input
        type="text"
        placeholder="Ativo (ex: BTC)"
        className="input input-bordered w-full bg-base-200 text-gray-100"
      />
      <input
        type="number"
        placeholder="Valor em USD"
        className="input input-bordered w-full bg-base-200 text-gray-100"
      />

      <button className="btn bg-yellow-400 text-black font-semibold">
        Comprar
      </button>
    </div>
  );
}
