import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { withdrawAccount } from "../../../api/accounts.api";

function WithdrawModal({ account, onClose }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: withdrawAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(["account", account.id]);

      onClose();
    },
    onError: (error) => {
      console.error("Create sub account failed:", error.message);
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
    mutate(payload);
  };

  return createPortal(
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-900 text-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold ">Widthdraw From {account.name}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium ">
                Amount
              </label>
              <input
                id="amount"
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
              <label
                htmlFor="description"
                className="block text-sm font-medium "
              >
                Description
              </label>
              <input
                id="description"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-lg p-2 mt-1 outline-none focus:ring-2 ring-green-400"
                placeholder="e.g. Monthly top-up"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300  rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Withdraw
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default WithdrawModal;
