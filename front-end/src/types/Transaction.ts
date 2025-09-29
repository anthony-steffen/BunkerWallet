import { Assets } from "./Assets";
import { Wallet } from "./Wallet";

export type Transaction = {
  id: number;
  wallet_id: number;
  asset_id: number;
  type: "buy" | "sell" | "deposit" | "withdraw" | string;
  amount: number;
  price_at_time: number;
  tx_hash?: string | null;
  timestamp?: string;
  // optionally expanded relations:
  asset?: Assets;
  wallet?: Wallet;
};