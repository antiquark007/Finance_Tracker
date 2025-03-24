import { useState, useEffect } from 'react';
import { TransactionProvider, useTransactions } from '@/context/TransactionContext';
import { TransactionDialog } from '@/components/TransactionDialog';
import { TransactionList } from '@/components/TransactionList';
import { MonthlyChart } from '@/components/MonthlyChart';
import { FinancialSummary } from '@/components/FinancialSummary';
import { Transaction, TransactionFormData } from '@/types/transaction';
import { CategoryPieChart } from '@/components/CategoryPieChart';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { CategoryMonthExpenses } from '@/components/CategoryMonthExpenses';

function Dashboard() {
  const { transactions, addTransaction, editTransaction, deleteTransaction, isLoading } = useTransactions();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [greeting, setGreeting] = useState('');
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const handleAddTransaction = (data: TransactionFormData) => {
    addTransaction(data);
  };

  const handleEditTransaction = (data: TransactionFormData) => {
    if (selectedTransaction) {
      editTransaction(selectedTransaction._id, data);
      setSelectedTransaction(null);
    }
  };

  const handleDeleteTransaction = (_id: string) => {
    deleteTransaction(_id);
  };

  const openEditDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <div>
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mx-auto"></div>
          <p className="mt-6 text-xl font-medium text-gray-700 dark:text-gray-300">Loading your finances...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <h2 className="text-4xl font-bold tracking-tight">{greeting}</h2>
          <p className="text-muted-foreground mt-1">Here's your financial overview for today</p>
        </motion.div>

        <div className="flex justify-end p-4">
          <TransactionDialog
            onSubmit={handleAddTransaction}
            title="Add New Transaction"
            description="Add a new income or expense transaction"
            submitLabel="Add Transaction"
            trigger={
              <Button className="gap-4  shadow-md hover:shadow-lg transition-all">
                <Plus className="h-1 w-4" /> New Transaction
              </Button>
            }
          />
        </div>

        <FinancialSummary transactions={transactions} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <CategoryPieChart transactions={transactions} />
        
        <MonthlyChart transactions={transactions} />
        <CategoryMonthExpenses 
          transactions={transactions} 
          formatCurrency={formatCurrency}
        />
          <TransactionList transactions={transactions} onEdit={openEditDialog} onDelete={handleDeleteTransaction} />
        </div>
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
