import { Transaction, TransactionFormData } from '@/types/transaction';

const API_URL = 'http://localhost:3000/api';

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await fetch(`${API_URL}/transactions`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch transactions: ${response.status}`);
  }
  
  const data = await response.json();
  
  return data.map((transaction: any) => ({
    ...transaction,
    date: new Date(transaction.date),
  }));
};

export const addTransaction = async (transaction: TransactionFormData): Promise<Transaction> => {
  const newTransaction = {
    ...transaction
  };

  const response = await fetch(`${API_URL}/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTransaction),
  });

  if (!response.ok) {
    throw new Error(`Failed to add transaction: ${response.status}`);
  }

  const result = await response.json();
  return {
    ...result,
    date: new Date(result.date)
  };
};

export const updateTransaction = async (_id: string, transaction: TransactionFormData): Promise<Transaction> => {
  if (!_id) throw new Error('Transaction ID is required');
  
  const updatedTransaction = {
    ...transaction
  };

  const response = await fetch(`${API_URL}/transactions/${_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedTransaction),
  });

  if (!response.ok) {
    throw new Error(`Failed to update transaction: ${response.status}`);
  }

  const result = await response.json();
  return {
    ...result,
    date: new Date(result.date)
  };
};

export const deleteTransaction = async (_id: string): Promise<void> => {
  if (!_id) {
    throw new Error('Transaction ID is required');
  }
  
  const response = await fetch(`${API_URL}/transactions/${_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(`Failed to delete transaction: ${response.status}`);
  }
};
