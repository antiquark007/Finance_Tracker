import { useMemo } from 'react';
import { ArrowDownCircle, ArrowUpCircle, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Transaction, TransactionCategory } from '@/types/transaction';

interface CategorySummary {
  categoryExpenses: Record<string, number>;
}

interface CategoryMonthExpensesProps {
  transactions: Transaction[];
  formatCurrency: (amount: number) => string;
}

export function CategoryMonthExpenses({
  transactions,
  formatCurrency,
}: CategoryMonthExpensesProps) {
  // Get current month name
  const getCurrentMonthName = () => {
    return new Date().toLocaleString('default', { month: 'long' });
  };

  // Calculate category-wise expenses for current month
  const summary = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    
    const categoryExpenses: Record<string, number> = {};
    
    // Filter transactions for current month and calculate sums by category
    transactions
      .filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return (
          transaction.type === 'expense' &&
          transactionDate.getFullYear() === currentYear &&
          transactionDate.getMonth() === currentMonth
        );
      })
      .forEach(transaction => {
        const category = transaction.category || 'uncategorized';
        categoryExpenses[category] = (categoryExpenses[category] || 0) + transaction.amount;
      });
    
    return { categoryExpenses };
  }, [transactions]);

  return (
    <Card className="mt-8 animate-fade-in">
      <CardHeader>
        <CardTitle>Category-wise Expenses ({getCurrentMonthName()})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(summary.categoryExpenses).length > 0 ? (
            Object.entries(summary.categoryExpenses).map(([category, amount]) => (
              <div 
                key={category} 
                className="flex items-center justify-between p-2 rounded-md bg-gray-50 dark:bg-gray-800"
              >
                <span className="text-sm font-medium capitalize">{category}</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatCurrency(amount)}
                </span>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-muted-foreground">
              No expenses for this month
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}