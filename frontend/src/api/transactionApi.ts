import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export interface TransactionFormData {
  amount: number;
  description: string;
  date: Date | string;
  category: string;
}

// Fetch all transactions
export const fetchTransactions = async () => {
  try {
    const response = await axios.get(`${API_URL}/transactions`, getAuthHeaders());
    return response.data.map((transaction: any) => ({
      ...transaction,
      date: new Date(transaction.date),
    }));
  } catch (error: any) {
    console.error("Error fetching transactions:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch transactions");
  }
};

export const addTransaction = async (transaction: TransactionFormData) => {
  try {
    const response = await axios.post(
      `${API_URL}/transactions`,
      {
        ...transaction,
        date: transaction.date instanceof Date ? transaction.date.toISOString() : transaction.date,
      },
      getAuthHeaders()
    );
    return { ...response.data, date: new Date(response.data.date) };
  } catch (error: any) {
    console.error("Error adding transaction:", error);
    throw new Error(error.response?.data?.message || "Failed to add transaction");
  }
};

export const updateTransaction = async (_id: string, transaction: TransactionFormData) => {
  try {
    const response = await axios.put(
      `${API_URL}/${_id}`,
      {
        ...transaction,
        date: transaction.date instanceof Date ? transaction.date.toISOString() : transaction.date, // Ensure date is sent as ISO string
      },
      getAuthHeaders()
    );
    // Convert the `date` field back to a Date object
    return { ...response.data, date: new Date(response.data.date) };
  } catch (error: any) {
    console.error("Error updating transaction:", error);
    throw new Error(error.response?.data?.message || "Failed to update transaction");
  }
};

export const deleteTransaction = async (_id: string) => {
  try {
    await axios.delete(`${API_URL}/${_id}`, getAuthHeaders());
  } catch (error: any) {
    console.error("Error deleting transaction:", error);
    throw new Error(error.response?.data?.message || "Failed to delete transaction");
  }
};