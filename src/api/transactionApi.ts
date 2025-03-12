
import { Transaction, TransactionFormData } from '@/types/transaction';
import { v4 as uuidv4 } from 'uuid';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const fetchTransactions = async (): Promise<Transaction[]> => {
  try {
    const response = await fetch(`${API_URL}/transactions`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    
    const data = await response.json();
    
    // Convert string dates back to Date objects
    return data.map((transaction: any) => ({
      ...transaction,
      date: new Date(transaction.date),
    }));
  } catch (error) {
    console.error('Error fetching transactions:', error);
    // Return the data from localStorage as fallback
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      return JSON.parse(savedTransactions).map((transaction: any) => ({
        ...transaction,
        date: new Date(transaction.date),
      }));
    }
    return [];
  }
};

export const addTransaction = async (transaction: TransactionFormData): Promise<Transaction> => {
  const newTransaction: Transaction = {
    id: uuidv4(),
    ...transaction
  };

  try {
    const response = await fetch(`${API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTransaction),
    });

    if (!response.ok) {
      throw new Error('Failed to add transaction');
    }

    return {
      ...newTransaction,
      date: new Date(newTransaction.date)
    };
  } catch (error) {
    console.error('Error adding transaction:', error);
    
    // Add to localStorage as fallback
    const savedTransactions = localStorage.getItem('transactions');
    const transactions = savedTransactions ? JSON.parse(savedTransactions) : [];
    localStorage.setItem('transactions', JSON.stringify([newTransaction, ...transactions]));
    
    return newTransaction;
  }
};

export const updateTransaction = async (id: string, transaction: TransactionFormData): Promise<Transaction> => {
  const updatedTransaction = {
    id,
    ...transaction
  };

  try {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTransaction),
    });

    if (!response.ok) {
      throw new Error('Failed to update transaction');
    }

    return {
      ...updatedTransaction,
      date: new Date(updatedTransaction.date)
    };
  } catch (error) {
    console.error('Error updating transaction:', error);
    
    // Update in localStorage as fallback
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      const transactions = JSON.parse(savedTransactions);
      const updatedTransactions = transactions.map((t: any) => 
        t.id === id ? updatedTransaction : t
      );
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    }
    
    return updatedTransaction;
  }
};

export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete transaction');
    }
  } catch (error) {
    console.error('Error deleting transaction:', error);
    
    // Delete from localStorage as fallback
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      const transactions = JSON.parse(savedTransactions);
      const filteredTransactions = transactions.filter((t: any) => t.id !== id);
      localStorage.setItem('transactions', JSON.stringify(filteredTransactions));
    }
  }
};
