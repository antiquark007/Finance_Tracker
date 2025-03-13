
export type TransactionType = 'income' | 'expense';


export type TransactionCategory =
  | 'uncategorized'
  | 'food'
  | 'transportation'
  | 'housing'
  | 'utilities'
  | 'entertainment'
  | 'healthcare'
  | 'shopping'
  | 'salary'
  | 'freelance'
  | 'other';
export interface Transaction {
  id?: string;       // Make id optional if it might not always be present
  _id?: string;      // Add _id for MongoDB responses
  amount: number;
  description: string;
  date: Date;
  type: TransactionType;
  category: TransactionCategory; 
}

export interface TransactionFormData { 
  amount: number;
  description: string;
  date: Date;
  type: TransactionType;
  category: TransactionCategory; 
}
