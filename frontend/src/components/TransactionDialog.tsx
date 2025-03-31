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
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function TransactionDialog({
  transaction,
  onSubmit,
  trigger,
  title,
  description,
  submitLabel,
  open,
  onOpenChange,
}: TransactionDialogProps) {
  const [localOpen, setLocalOpen] = useState(false);
  const isOpen = open !== undefined ? open : localOpen;
  const setIsOpen = onOpenChange || setLocalOpen;

  const handleSubmit = (data: TransactionFormData) => {
    onSubmit(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <TransactionForm
          onSubmit={handleSubmit}
          initialData={transaction}
          submitLabel={submitLabel}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}