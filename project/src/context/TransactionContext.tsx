
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, TransactionFormData } from '@/types/transaction';
import { v4 as uuidv4 } from 'uuid';
import { toast } from "sonner";

interface TransactionContextType {
  transactions: Transaction[];
  addTransaction: (transaction: TransactionFormData) => void;
  editTransaction: (id: string, transaction: TransactionFormData) => void;
  deleteTransaction: (id: string) => void;
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

  // Load transactions from localStorage on initial render
  useEffect(() => {
    try {
      const savedTransactions = localStorage.getItem('transactions');
      if (savedTransactions) {
        // Convert string dates back to Date objects
        const parsedTransactions = JSON.parse(savedTransactions).map((transaction: any) => ({
          ...transaction,
          date: new Date(transaction.date),
        }));
        setTransactions(parsedTransactions);
      } else {
        // Set sample data if nothing exists
        setTransactions(getSampleTransactions());
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error("Couldn't load your transactions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save transactions to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions, isLoading]);

  // Add a new transaction
  const addTransaction = (transaction: TransactionFormData) => {
    const newTransaction: Transaction = {
      id: uuidv4(),
      ...transaction,
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    toast.success("Transaction added");
  };

  // Edit an existing transaction
  const editTransaction = (id: string, transactionData: TransactionFormData) => {
    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id
          ? { ...transaction, ...transactionData }
          : transaction
      )
    );
    toast.success("Transaction updated");
  };

  // Delete a transaction
  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
    toast.success("Transaction deleted");
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
      id: uuidv4(),
      amount: 2500,
      description: "Salary",
      date: new Date(today.getFullYear(), today.getMonth(), 5),
      type: "income"
    },
    {
      id: uuidv4(),
      amount: 120.50,
      description: "Grocery shopping",
      date: new Date(today.getFullYear(), today.getMonth(), 12),
      type: "expense"
    },
    {
      id: uuidv4(),
      amount: 45.99,
      description: "Internet bill",
      date: new Date(today.getFullYear(), today.getMonth(), 15),
      type: "expense"
    },
    {
      id: uuidv4(),
      amount: 800,
      description: "Rent",
      date: new Date(today.getFullYear(), today.getMonth(), 1),
      type: "expense"
    },
    {
      id: uuidv4(),
      amount: 56.28,
      description: "Gas",
      date: new Date(today.getFullYear(), today.getMonth(), 18),
      type: "expense"
    },
    {
      id: uuidv4(),
      amount: 500,
      description: "Freelance work",
      date: new Date(today.getFullYear(), today.getMonth(), 22),
      type: "income"
    },
    {
      id: uuidv4(),
      amount: 2500,
      description: "Salary",
      date: new Date(oneMonthAgo.getFullYear(), oneMonthAgo.getMonth(), 5),
      type: "income"
    },
    {
      id: uuidv4(),
      amount: 350,
      description: "Car repair",
      date: new Date(oneMonthAgo.getFullYear(), oneMonthAgo.getMonth(), 10),
      type: "expense"
    }
  ];
}
