import React, { useState } from "react";
import { createPortal } from "react-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAccount } from "../../features/accounts/mainaccounts";

function CreateModal({ onClose }) {
  const [formData, setFormData] = useState({ name: "", initialBalance: "" });

  const queryClient = useQueryClient();
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(["accounts"]);
      setFormData({ name: "", initialBalance: "" });
      onClose();
    },
    onError: (error) => {
      console.error("Deposit failed:", error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.initialBalance) {
      return;
    }

    const payload = {
      name: formData.name,
      initialBalance: parseFloat(formData.initialBalance),
    };


    mutate(payload);
  }

  return createPortal(
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className=" bg-slate-900 text-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <h3 className="text-xl font-semibold mb-4">Create New Account</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium ">Account Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
             className="w-full border rounded-lg p-2 mt-1 outline-none focus:ring-2 ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Initial Balance</label>
            <input
              type="number"
              required
              value={formData.initialBalance}
              onChange={(e) =>
                setFormData({ ...formData, initialBalance: e.target.value })
              }
               className="w-full border rounded-lg p-2 mt-1 outline-none focus:ring-2 ring-blue-400"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className={`px-4 py-2 text-sm rounded-md text-white ${
                isPending
                  ? "bg-blue-300"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isPending ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default CreateModal;
