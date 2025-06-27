import axiosInstance from "./axiosInstance";

export const createSubAccount = async ({ accountId, name, description, targetAmount, balance, scheme}) => {
  const data = {
    name,
    description: description || "",
    targetAmount: parseFloat(targetAmount),
    balance: parseFloat(balance),
    scheme,
  };
  console.log(`Creating sub-account for account ID: ${accountId}`, data);
  const response = await axiosInstance.post(`/accounts/${accountId}/sub-accounts`, data);
  return response.data;
};


export const allocateSubAccount = async ({ accountId, amount, description }) => {
    const payload = {
      type: "ALLOCATION",
      accountId,
      amount,
      accountType: "sub", 
      description: description || "",
    };
  const response = await axiosInstance.post(`/transactions`, payload);
  return response.data;
}

export const withdrawSubAccount = async ({ accountId, amount, description }) => {
    const payload = {
      type: "WITHDRAWAL",
      accountId,
      amount,
      accountType: "sub", 
      description: description || "",
    };
  const response = await axiosInstance.post(`/transactions`, payload);
  return response.data;
}

export const transfer = async ({ accountId, toAccountId, amount, description }) => {
    const payload = {
      type: "TRANSFER",
      accountId,
      toAccountId,
      amount,
      accountType: "sub", 
      description: description || "",
    };
    console.log(payload);
    
  const response = await axiosInstance.post(`/transactions`, payload);
  return response.data;
}


export const fetchSubAccountsTransactions = async (mainAccountId) => {
  console.log(`Fetching transactions for main account ID: ${mainAccountId}`);
  
  const response = await axiosInstance.get(`/transactions/subaccounts/${mainAccountId}`);
 
  return response.data;
}