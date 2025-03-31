import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction, TransactionCategory } from '@/types/transaction';

interface CategoryPieChartProps {
  transactions: Transaction[];
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#AF19FF',
  '#FF1985',
  '#7BFF19',
  '#19FFC2',
  '#19A3FF',
  '#A319FF',
  '#FF5733',
];

export function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  const categoryData = useMemo(() => {
    const categoryTotals: { [key in TransactionCategory]: number } = {
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

    transactions
      .filter((t) => t.type === 'expense')
      .forEach((transaction) => {
        categoryTotals[transaction.category] += transaction.amount;
      });

    const data = Object.entries(categoryTotals)
      .map(([category, value]) => ({
        name: category,
        value: value,
      }))
      .filter((item) => item.value > 0); // Filter out categories with no expenses

    return data;
  }, [transactions]);

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Expense Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              dataKey="value"
              isAnimationActive={false}
              data={categoryData}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              label
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}