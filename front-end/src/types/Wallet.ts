export interface Wallet {
  id: number;
  name: string;
  description?: string | null;
  user_id?: number;
  created_at?: string;
  balance?: number | null;
}
