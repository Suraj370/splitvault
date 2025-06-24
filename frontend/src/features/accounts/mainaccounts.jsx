import axios from "axios";
import axiosInstance from "../../api/axiosInstance";
import { Currency } from "lucide-react";

export const fetchAccounts = async () => {
  const res = await axiosInstance.get("/accounts");

  return res.data.data;
};

export const createAccount = async ({name, initialBalance}) => {
  const payload = {
    name,
    currency: "INR", 
    initialBalance,
  };
  console.log("API payload:", payload); // Debug API payload

  const res = await axiosInstance.post("/accounts", payload);
  return res.data.data;

}

export const depositAccount = async ({ accountId, amount, description }) => {
  
    const payload = {
      type: "DEPOSIT",
      accountId,
      amount,
      accountType: "main", // Hardcoded as per original logic
      description: description || "",
    };
    console.log("API payload:", payload); // Debug API payload

    const res = await axiosInstance.post("/transactions", payload);
    return res.data.data;

};

