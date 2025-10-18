// src/components/transactions/SwapCryptoForm.tsx
import React, { useState, useMemo } from "react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { useTopAssets } from "@/hooks/useAssets";

export default function SwapCryptoForm() {
  const { data: portfolio } = usePortfolio();
  const { data: topAssets } = useTopAssets();
  const assets = React.useMemo(() => portfolio?.assets ?? [], [portfolio?.assets]);

  const [fromSymbol, setFromSymbol] = useState("");
  const [toSymbol, setToSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [value, setValue] = useState("");

  const fromAsset = useMemo(
    () =>
      assets.find(
        (a) => a.symbol.toLowerCase() === fromSymbol.toLowerCase()
      ),
    [fromSymbol, assets]
  );

  const toAsset = useMemo(
    () =>
      topAssets?.find(
        (a: any) => a.symbol.toLowerCase() === toSymbol.toLowerCase()
      ),
    [toSymbol, topAssets]
  );

  const fromPrice = fromAsset?.current_price ?? 0;
  const toPrice = toAsset?.current_price ?? 0;

  const handleQuantityChange = (q: string) => {
    setQuantity(q);
    const qty = parseFloat(q);
    if (!isNaN(qty)) setValue((qty * fromPrice).toFixed(2));
  };

  const handleValueChange = (v: string) => {
    setValue(v);
    const val = parseFloat(v);
    if (!isNaN(val) && fromPrice > 0)
      setQuantity((val / fromPrice).toFixed(6));
  };

  const estimatedToAmount =
    !isNaN(parseFloat(value)) && toPrice > 0
      ? (parseFloat(value) / toPrice).toFixed(6)
      : "0";

  return (
    <div className="bg-base-100/20 p-6 rounded-xl shadow-lg w-full max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4 text-gray-100">Trocar Cripto</h2>

      {/* From asset */}
      <label className="block text-sm text-gray-400 mb-2">De</label>
      <select
        value={fromSymbol}
        onChange={(e) => setFromSymbol(e.target.value)}
        className="select select-bordered w-full mb-4 bg-base-200 text-gray-100"
      >
        <option value="">Selecione ativo de origem</option>
        {assets.map((asset) => (
          <option key={asset.symbol} value={asset.symbol}>
            {asset.name} ({asset.symbol.toUpperCase()})
          </option>
        ))}
      </select>

      {/* To asset */}
      <label className="block text-sm text-gray-400 mb-2">Para</label>
      <select
        value={toSymbol}
        onChange={(e) => setToSymbol(e.target.value)}
        className="select select-bordered w-full mb-4 bg-base-200 text-gray-100"
      >
        <option value="">Selecione ativo de destino</option>
        {topAssets?.map((asset: any) => (
          <option key={asset.symbol} value={asset.symbol}>
            {asset.name} ({asset.symbol.toUpperCase()})
          </option>
        ))}
      </select>

      {/* Quantity & Value */}
      <label className="block text-sm text-gray-400 mb-1">Quantidade</label>
      <input
        type="number"
        value={quantity}
        onChange={(e) => handleQuantityChange(e.target.value)}
        placeholder="Ex: 0.005"
        className="input input-bordered w-full mb-3 bg-base-200 text-gray-100"
      />

      <label className="block text-sm text-gray-400 mb-1">Valor (USD)</label>
      <input
        type="number"
        value={value}
        onChange={(e) => handleValueChange(e.target.value)}
        placeholder="Ex: 150"
        className="input input-bordered w-full mb-3 bg-base-200 text-gray-100"
      />

      {quantity && fromAsset && (
        <span className="text-gray-400 text-xs block">
          {quantity} {fromSymbol.toUpperCase()} ≈ ${value}
        </span>
      )}

      {toAsset && value && (
        <span className="text-gray-400 text-xs block mt-1">
          Você receberá aproximadamente {estimatedToAmount}{" "}
          {toSymbol.toUpperCase()}
        </span>
      )}

      <button className="btn btn-primary w-full mt-6">Trocar</button>
    </div>
  );
}
