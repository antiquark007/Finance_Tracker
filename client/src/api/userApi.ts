import axios from "axios";
import { userRegister } from "@/types/user";

const API_URL = 'http://localhost:3000/api/user';

export const registerUser = async (userData: userRegister) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error: any) {
    // Check if the error is due to an existing email
    if (error.response?.status === 400 && error.response?.data?.message === "User already exists") {
      alert("The email already exists")
      throw new Error("This email is already registered. Please use a different email.");
    }
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};