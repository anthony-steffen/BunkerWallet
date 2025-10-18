// src/components/transactions/SendCryptoForm.tsx
import React, { useState, useMemo } from "react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { toast } from "react-toastify";

export default function SendCryptoForm() {
const { data: portfolio, isLoading, error } = usePortfolio(1);
console.log("📦 portfolio:", portfolio);


  const [selectedSymbol, setSelectedSymbol] = useState("");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [usdValue, setUsdValue] = useState("");

  const selectedAsset = useMemo(
    () => portfolio?.assets?.find((a) => a.symbol === selectedSymbol),
    [portfolio, selectedSymbol]
  );

  // 🔄 Cálculo dinâmico: valor ↔ quantidade
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    if (selectedAsset && value) {
      const usd = parseFloat(value) * selectedAsset.current_price;
      setUsdValue(usd.toFixed(2));
    } else {
      setUsdValue("");
    }
  };

  const handleUsdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsdValue(value);
    if (selectedAsset && value) {
      const qty = parseFloat(value) / selectedAsset.current_price;
      setAmount(qty.toFixed(6));
    } else {
      setAmount("");
    }
  };

  const handleSend = () => {
    if (!selectedAsset || !amount || !address) {
      toast.error("Preencha todos os campos!");
      return;
    }
    toast.success(
      `Enviando ${amount} ${selectedAsset.symbol} (${usdValue} USD) para ${address}`
    );
  };

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar!</p>;

  return (
    <div className="bg-base-200/20 p-6 rounded-xl">
      <h3 className="text-lg font-semibold mb-4 text-gray-100">Enviar Criptoativo</h3>

      {/* Seleção de ativo */}
      <select
        className="select select-bordered w-full mb-3 bg-base-100 text-gray-200"
        value={selectedSymbol}
        onChange={(e) => setSelectedSymbol(e.target.value)}
      >
        <option value="">Selecione o ativo</option>
        {portfolio?.assets?.map((asset) => (
          <option key={asset.symbol} value={asset.symbol}>
            {asset.name} ({asset.symbol})
          </option>
        ))}
      </select>

      {/* Quantidade */}
      <input
        type="number"
        placeholder="Quantidade a enviar"
        className="input input-bordered w-full mb-3 bg-base-100 text-gray-200"
        value={amount}
        onChange={handleAmountChange}
      />

      {/* Valor em USD */}
      <input
        type="number"
        placeholder="Valor em USD"
        className="input input-bordered w-full mb-3 bg-base-100 text-gray-200"
        value={usdValue}
        onChange={handleUsdChange}
      />

      {/* Endereço de destino */}
      <input
        type="text"
        placeholder="Endereço de destino"
        className="input input-bordered w-full mb-4 bg-base-100 text-gray-200"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <button
        className="btn btn-primary w-full"
        onClick={handleSend}
        disabled={!selectedSymbol || !amount || !address}
      >
        Enviar
      </button>
    </div>
  );
}
