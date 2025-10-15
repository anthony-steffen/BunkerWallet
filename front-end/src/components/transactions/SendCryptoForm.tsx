import React from "react";

export default function SendCryptoForm() {
  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-2 text-center">Enviar Cripto</h2>
      <p className="text-sm text-gray-400 text-center">
        Insira o endereço de destino e a quantidade que deseja enviar.
      </p>

      <input
        type="text"
        placeholder="Ativo (ex: BTC)"
        className="input input-bordered w-full bg-base-200 text-gray-100"
      />
      <input
        type="text"
        placeholder="Endereço de destino"
        className="input input-bordered w-full bg-base-200 text-gray-100"
      />
      <input
        type="number"
        placeholder="Quantidade"
        className="input input-bordered w-full bg-base-200 text-gray-100"
      />

      <button className="btn bg-yellow-400 border-none text-black font-semibold">
        Enviar
      </button>
    </div>
  );
}
