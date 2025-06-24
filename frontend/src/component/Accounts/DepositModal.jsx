// components/DepositModal.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
 
import { depositAccount } from "../../features/accounts/mainaccounts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
function DepositModal({ onClose, account }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: depositAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(["accounts", account.id]);
      onClose();
    },
    onError: (error) => {
      console.error("Deposit failed:", error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return;
    }

    const payload = {
      accountId: account.id,
      amount: parseFloat(amount),
      description: description || "", // Ensure description is a string
    };

    console.log("Sending payload:", payload); // Debug payload

    mutate(payload);
  };
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-40">
      <div className="bg-slate-900 text-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-xl font-bold mb-4 ">
          Deposit to {account.name}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium ">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1 outline-none focus:ring-2 ring-green-400"
              placeholder="Enter amount"
              min="1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium ">
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border rounded-lg p-2 mt-1 outline-none focus:ring-2 ring-green-400"
              placeholder="e.g. Monthly top-up"
            />
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              Confirm Deposit
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default DepositModal;
