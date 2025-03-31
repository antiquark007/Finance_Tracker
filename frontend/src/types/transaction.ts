
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
  _id: string;      
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
