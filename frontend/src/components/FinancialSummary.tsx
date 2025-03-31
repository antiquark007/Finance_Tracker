import { useMemo } from 'react';
import { ArrowDownCircle, ArrowUpCircle, TrendingUp, TrendingDown } from 'lucide-react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Transaction, TransactionCategory } from '@/types/transaction';

interface FinancialSummaryProps {
  transactions: Transaction[];
}

export function FinancialSummary({ transactions }: FinancialSummaryProps) {
  const summary = useMemo(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const currentMonthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date); // Ensure `date` is a Date object
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });

    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const previousMonthTransactions = transactions.filter((t) => {
      const transactionDate = new Date(t.date); // Ensure `date` is a Date object
      return (
        transactionDate.getMonth() === previousMonth &&
        transactionDate.getFullYear() === previousYear
      );
    });

    const currentIncome = currentMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentExpense = currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const currentBalance = currentIncome - currentExpense;

    const previousIncome = previousMonthTransactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const previousExpense = previousMonthTransactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const previousBalance = previousIncome - previousExpense;

    const incomeChange = previousIncome === 0 ? 100 : ((currentIncome - previousIncome) / previousIncome) * 100;

    const expenseChange = previousExpense === 0 ? 100 : ((currentExpense - previousExpense) / previousExpense) * 100;

    const balanceChange = previousBalance === 0
      ? 100
      : ((currentBalance - previousBalance) / Math.abs(previousBalance)) * 100;

    const categoryExpenses: { [key in TransactionCategory]: number } = {
      uncategorized: 0,
      food: 0,
      transportation: 0,
      housing: 0,
      utilities: 0,
      entertainment: 0,
      healthcare: 0,
      shopping: 0,
      salary: 0,
      freelance: 0,
      other: 0,
    };

    currentMonthTransactions
      .filter((t) => t.type === 'expense')
      .forEach((transaction) => {
        categoryExpenses[transaction.category] += transaction.amount;
      });

    return {
      income: {
        current: currentIncome,
        previous: previousIncome,
        change: incomeChange,
      },
      expense: {
        current: currentExpense,
        previous: previousExpense,
        change: expenseChange,
      },
      balance: {
        current: currentBalance,
        previous: previousBalance,
        change: balanceChange,
      },
      categoryExpenses: categoryExpenses,
    };
  }, [transactions]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };
  
  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${Math.round(value)}%`;
  };

  const getCurrentMonthName = () => {
    return new Date().toLocaleString('default', { month: 'long' });
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
        {/* Income Card */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/10 border-green-200 dark:border-green-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  Total Income
                </p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(summary.income.current)}</h3>
                <p className="text-xs mt-1 text-muted-foreground">{getCurrentMonthName()}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-800/30 flex items-center justify-center">
                <ArrowUpCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              {summary.income.change > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 dark:text-red-400 mr-1" />
              )}
              <span
                className={summary.income.change > 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}
              >
                {formatPercentage(summary.income.change)}
              </span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Expense Card */}
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/10 border-red-200 dark:border-red-800">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  Total Expenses
                </p>
                <h3 className="text-2xl font-bold mt-1">{formatCurrency(summary.expense.current)}</h3>
                <p className="text-xs mt-1 text-muted-foreground">{getCurrentMonthName()}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-800/30 flex items-center justify-center">
                <ArrowDownCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              {summary.expense.change < 0 ? (
                <TrendingDown className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
              ) : (
                <TrendingUp className="h-4 w-4 text-red-500 dark:text-red-400 mr-1" />
              )}
              <span
                className={summary.expense.change < 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}
              >
                {formatPercentage(summary.expense.change)}
              </span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Balance Card */}
        <Card className={`
        ${summary.balance.current >= 0
            ? "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/10 border-blue-200 dark:border-blue-800"
            : "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10 border-amber-200 dark:border-amber-800"
          }
      `}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className={`
                text-sm font-medium 
                ${summary.balance.current >= 0
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-amber-600 dark:text-amber-400"
                  }
              `}>
                  Net Balance
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {summary.balance.current >= 0 ? '' : '-'}
                  {formatCurrency(summary.balance.current)}
                </h3>
                <p className="text-xs mt-1 text-muted-foreground">{getCurrentMonthName()}</p>
              </div>
              <div className={`
              h-10 w-10 rounded-full flex items-center justify-center
              ${summary.balance.current >= 0
                  ? "bg-blue-100 dark:bg-blue-800/30"
                  : "bg-amber-100 dark:bg-amber-800/30"
                }
            `}>
                {summary.balance.current >= 0 ? (
                  <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                )}
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs">
              {summary.balance.change > 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 dark:text-red-400 mr-1" />
              )}
              <span
                className={summary.balance.change > 0 ? "text-green-600 dark:text-green-400" : "text-red-500 dark:text-red-400"}
              >
                {formatPercentage(summary.balance.change)}
              </span>
              <span className="text-muted-foreground ml-1">vs last month</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}