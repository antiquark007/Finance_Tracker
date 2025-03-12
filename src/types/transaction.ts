
export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
  type: TransactionType;
}

export interface TransactionFormData {
  amount: number;
  description: string;
  date: Date;
  type: TransactionType;
}
