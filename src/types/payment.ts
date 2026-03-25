export type TxType   = "Deposit" | "Withdraw" | "Transfer" | "FundDeal";
export type TxStatus = "Completed" | "Pending" | "Failed";

export interface Transaction {
  id: number;
  type: TxType;
  amount: number;
  sender: string;
  receiver: string;
  status: TxStatus;
  date: string;
  description?: string;
}

export interface Wallet {
  balance: number;
  currency: string;
}

export interface Deal {
  id: string;
  title: string;
  founder: string;
  target: number;
  raised: number;
}