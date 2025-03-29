import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, TransactionFormData } from '@/types/transaction';
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { 
  fetchTransactions as apiFetchTransactions,
  addTransaction as apiAddTransaction,
  updateTransaction as apiUpdateTransaction,
  deleteTransaction as apiDeleteTransaction
} from '@/api/transactionApi';

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: TransactionFormData) => void;
  editTransaction: (_id: string, transaction: TransactionFormData) => void;
  deleteTransaction: (_id: string) => void;
  isLoading: boolean;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}

export function TransactionProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load transactions from API on initial render
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const fetchedTransactions = await apiFetchTransactions();
        if (fetchedTransactions.length > 0) {
          setTransactions(fetchedTransactions);
        } else {
          // Set sample data if nothing exists
          setTransactions(getSampleTransactions());
        }
      } catch (error) {
        console.error('Error loading transactions:', error);
        toast.error("Couldn't load your transactions");
        // Set sample data if API fails
        setTransactions(getSampleTransactions());
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // Add a new transaction
  const addTransaction = async (transaction: TransactionFormData) => {
    try {
      const newTransaction = await apiAddTransaction(transaction);
      setTransactions((prev) => [newTransaction, ...prev]);
      toast.success("Transaction added");
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error("Failed to add transaction");
    }
  };

  // Edit an existing transaction
  const editTransaction = async (_id: string, transactionData: TransactionFormData) => {
    try {
      const updatedTransaction = await apiUpdateTransaction(_id, transactionData);
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction._id === _id
            ? updatedTransaction
            : transaction
        )
      );
      toast.success("Transaction updated");
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error("Failed to update transaction");
    }
  };

  // Delete a transaction
  const deleteTransaction = async (_id: string) => {
    if (!_id) {
      console.error('Cannot delete transaction: Missing ID');
      toast.error("Failed to delete transaction: Missing ID");
      return;
    }
    
    try {
      await apiDeleteTransaction(_id);
      // Update both id and _id matches to ensure everything gets filtered properly
      setTransactions((prev) => prev.filter((t) => t._id !== _id && t._id !== _id));//will fix later
      toast.success("Transaction deleted");
    } catch (error) {
      console.error('Error deleting transaction:', error);
      toast.error("Failed to delete transaction");
    }
  };

  const value = {
    transactions,
    addTransaction,
    editTransaction,
    deleteTransaction,
    isLoading,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

// Sample transaction data for initial state
function getSampleTransactions(): Transaction[] {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);

  return [
    {
      _id: uuidv4(),
      amount: 2500,
      description: "Salary",
      date: new Date(today.getFullYear(), today.getMonth(), 5),
      type: "income",
      category:"salary"
    },
  ];
}
