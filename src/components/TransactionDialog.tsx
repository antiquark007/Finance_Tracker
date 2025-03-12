import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TransactionForm } from '@/components/TransactionForm';
import { Plus } from 'lucide-react';
import { Transaction, TransactionFormData } from '@/types/transaction';

interface TransactionDialogProps {
  transaction?: Transaction;
  onSubmit: (data: TransactionFormData) => void;
  trigger?: React.ReactNode;
  title: string;
  description?: string;
  submitLabel: string;
}

export function TransactionDialog({
  transaction,
  onSubmit,
  trigger,
  title,
  description,
  submitLabel,
}: TransactionDialogProps) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (data: TransactionFormData) => {
    onSubmit(data);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-1">
            <Plus className="h-4 w-4" /> Add Transaction
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <TransactionForm
          onSubmit={handleSubmit}
          initialData={transaction}
          submitLabel={submitLabel}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}