
import { useState } from 'react';
import { TransactionProvider, useTransactions } from '@/context/TransactionContext';
import { TransactionDialog } from '@/components/TransactionDialog';
import { TransactionList } from '@/components/TransactionList';
import { MonthlyChart } from '@/components/MonthlyChart';
import { FinancialSummary } from '@/components/FinancialSummary';
import { Transaction, TransactionFormData } from '@/types/transaction';

function Dashboard() {
  const { transactions, addTransaction, editTransaction, deleteTransaction, isLoading } = useTransactions();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleAddTransaction = (data: TransactionFormData) => {
    addTransaction(data);
  };

  const handleEditTransaction = (data: TransactionFormData) => {
    if (selectedTransaction) {
      editTransaction(selectedTransaction.id, data);
      setSelectedTransaction(null);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    deleteTransaction(id);
  };

  const openEditDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-xl font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 space-y-8 animate-fade-in animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personal Finance Tracker</h1>
          <p className="text-muted-foreground">Track and visualize your financial activities</p>
        </div>
        <div className="flex space-x-2">
          <TransactionDialog
            onSubmit={handleAddTransaction}
            title="Add New Transaction"
            description="Add a new income or expense transaction"
            submitLabel="Add Transaction"
          />
          {selectedTransaction && (
            <TransactionDialog
              transaction={selectedTransaction}
              onSubmit={handleEditTransaction}
              title="Edit Transaction"
              description="Update transaction details"
              submitLabel="Save Changes"
              trigger={<div />} // Hidden trigger since we open programmatically
            />
          )}
        </div>
      </div>

      <FinancialSummary transactions={transactions} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <MonthlyChart transactions={transactions} />
        <TransactionList
          transactions={transactions}
          onEdit={openEditDialog}
          onDelete={handleDeleteTransaction}
        />
      </div>
    </div>
  );
}

const Index = () => {
  return (
    <TransactionProvider>
      <Dashboard />
    </TransactionProvider>
  );
};

export default Index;
