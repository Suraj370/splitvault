import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transfer } from "../../../api/subaccounts.api";
function TransferFunds({ account, subAccounts, onClose }) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [targetId, setTargetId] = useState("");

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: transfer,
    onSuccess: () => {
      queryClient.invalidateQueries(["account", account.id]);
      onClose();
    },
    onError: (error) => {
      console.error("Transfer failed:", error.message);
    },
  });

  const availableTargets = subAccounts.filter((sa) => sa.id !== account.id);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!targetId || !amount || parseFloat(amount) <= 0) {
      return;
    }

    // TODO: Replace this with actual mutation

    const payload = {
      accountId: account.id,
      toAccountId: targetId,
      amount: parseFloat(amount),
      description: description || "",
    };
    mutation.mutate(payload);

    // Close after success or add loading + error state
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-xl max-w-md w-full p-6 relative shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Transfer from: {account.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="to-account"
              className="block text-sm font-medium mb-1"
            >
              To Sub-Account
            </label>
            <select
              id="to-account"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
              required
            >
              <option value="">Select target account</option>
              {availableTargets.map((target) => (
                <option key={target.id} value={target.id}>
                  {target.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium mb-1">
              Amount (₹)
            </label>
            <input
              id="amount"
              type="number"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min={1}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Description
            </label>
            <input
              id="description"
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional note"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white rounded py-2 hover:bg-blue-700 transition-colors"
          >
            Transfer Funds
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default TransferFunds;
