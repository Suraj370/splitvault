import axiosInstance from "./axiosInstance";

export const fetchAccounts = async () => {
  const res = await axiosInstance.get("/accounts");

  return res.data.data;
};

export const fetchAccountById = async (id) => {
  const res = await axiosInstance.get(`/accounts/${id}`);
  return res.data.data;
};

export const createAccount = async ({name, initialBalance}) => {
  const payload = {
    name,
    currency: "INR", 
    initialBalance,
  };

  const res = await axiosInstance.post("/accounts", payload);
  return res.data.data;

}

export const depositAccount = async ({ accountId, amount, description }) => {
  
    const payload = {
      type: "DEPOSIT",
      accountId,
      amount,
      accountType: "main", 
      description: description || "",
    };

    const res = await axiosInstance.post("/transactions", payload);
    return res.data.data;

};


export const withdrawAccount = async ({ accountId, amount, description }) => {
    const payload = {
      type: "WITHDRAWAL",
      accountId,
      amount,
      accountType: "main", 
      description: description || "",
    };
  const response = await axiosInstance.post(`/transactions`, payload);
  return response.data;
}
