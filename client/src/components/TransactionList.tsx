import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { Edit, Trash2, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Transaction } from '@/types/transaction';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return [...transactions]
      .filter((transaction) => {
        const searchTermLower = searchTerm.toLowerCase();
        return (
          transaction.description.toLowerCase().includes(searchTermLower) ||
          transaction.amount.toString().includes(searchTermLower) ||
          transaction.type.toLowerCase().includes(searchTermLower) ||
          format(transaction.date, 'PPP').toLowerCase().includes(searchTermLower) ||
          (transaction.category && transaction.category.toLowerCase().includes(searchTermLower))
        );
      });
  }, [transactions, searchTerm]);

  // Format currency as Indian Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0, // Optional: removes decimal places for whole rupee amounts
    }).format(amount);
  };

  if (transactions.length === 0) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>You have no transactions yet.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>Manage your financial activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((transaction) => (
                  <TableRow key={transaction._id}>
                    <TableCell>{format(transaction.date, 'MMM dd, yyyy')}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="h-4 w-4 text-finance-income" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-finance-expense" />
                        )}
                        <span>{transaction.description}</span>
                        <Badge variant={transaction.type === 'income' ? 'outline' : 'secondary'} className="ml-auto md:hidden">
                          {transaction.type === 'income' ? 'Income' : 'Expense'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className={`text-right font-medium ${transaction.type === 'income' ? 'text-finance-income' : 'text-finance-expense'
                      }`}>
                      {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                    </TableCell>
                    <TableCell>{transaction.category || 'Uncategorized'}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(transaction)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this transaction? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={(e) => {
                                  //e.preventDefault();

                                  const _id = transaction._id;

                                  if (!_id) {
                                    console.error("Cannot delete transaction: Missing ID");
                                    return;
                                  }

                                  console.log("Deleting transaction with ID:", _id);
                                  onDelete(_id);
                                }}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground">
        <div>Showing {filteredTransactions.length} of {transactions.length} transactions</div>
      </CardFooter>
    </Card>
  );
}