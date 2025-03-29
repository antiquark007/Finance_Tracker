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
  addTransaction: (transaction: TransactionFormData) => Promise<void>;
  editTransaction: (_id: string, transaction: TransactionFormData) => Promise<void>;
  deleteTransaction: (_id: string) => Promise<void>;
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

useEffect(() => {
  const loadTransactions = async () => {
    try {
      const fetchedTransactions = await apiFetchTransactions();

      const transactionsWithDate = fetchedTransactions.map((transaction) => ({
        ...transaction,
        date: new Date(transaction.date),
      }));

      setTransactions(transactionsWithDate);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error("Couldn't load your transactions");
      setTransactions(getSampleTransactions());
    } finally {
      setIsLoading(false);
    }
  };

  loadTransactions();
}, []);

  const addTransaction = async (transaction: TransactionFormData) => {
    try {
      const newTransaction = await apiAddTransaction({
        ...transaction,
        date: transaction.date.toISOString(),
      });
      setTransactions((prev) => [newTransaction, ...prev]);
      toast.success("Transaction added successfully");
    } catch (error) {
      console.error('Error adding transaction:', error);
      toast.error("Failed to add transaction");
    }
  };

  const editTransaction = async (_id: string, transactionData: TransactionFormData) => {
    try {
      const updatedTransaction = await apiUpdateTransaction(_id, {
        ...transactionData,
        date: transactionData.date.toISOString(),
      });
      setTransactions((prev) =>
        prev.map((transaction) =>
          transaction._id === _id ? updatedTransaction : transaction
        )
      );
      toast.success("Transaction updated successfully");
    } catch (error) {
      console.error('Error updating transaction:', error);
      toast.error("Failed to update transaction");
    }
  };

  const deleteTransaction = async (_id: string) => {
    if (!_id) {
      console.error('Cannot delete transaction: Missing ID');
      toast.error("Failed to delete transaction: Missing ID");
      return;
    }

    try {
      await apiDeleteTransaction(_id);
      setTransactions((prev) => prev.filter((transaction) => transaction._id !== _id));
      toast.success("Transaction deleted successfully");
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
      category: "salary",
    },
    {
      _id: uuidv4(),
      amount: 500,
      description: "Groceries",
      date: new Date(today.getFullYear(), today.getMonth(), 10),
      type: "expense",
      category: "food",
    },
  ];
}