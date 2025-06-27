import React, { useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubAccount } from "../../../api/subaccounts.api";

function CreateSubModal({ account, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    targetAmount: "",
    balance: "",
    scheme: "",
  });

  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: createSubAccount,
    onSuccess: () => {
      queryClient.invalidateQueries(["account", account.id]);
      setFormData({
        name: "",
        description: "",
        targetAmount: "",
        balance: "",
        scheme: "",
      });
      onClose();
    },
    onError: (error) => {
      console.error("Create sub account failed:", error.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.targetAmount ||
      !formData.balance ||
      !formData.scheme
    ) {
      return;
    }
    const payload = {
      accountId: account.id,
      name: formData.name,
      description: formData.description || "",
      targetAmount: parseFloat(formData.targetAmount),
      balance: parseFloat(formData.balance),
      scheme: formData.scheme,
    };
    mutate(payload);
  };

  return createPortal(
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-900 text-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6 ">
            <h2 className="text-xl font-bold">Create New Savings Goal</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label htmlFor="goalName" className="block text-sm font-medium mb-2">
                Goal Name
              </label>
              <input
                id="goalName"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Emergency Fund"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief description of your savings goal"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="scheme" className="block text-sm font-medium mb-2">
                Scheme
              </label>
              <select
                id="scheme"
                value={formData.scheme}
                onChange={(e) => setFormData({ ...formData, scheme: e.target.value })}
                className="w-full px-3 py-2 border bg-slate-900 text-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a scheme</option>
                <option value="emergency">Emergency</option>
                <option value="vacation">Vacation</option>
                <option value="home">Home</option>
                <option value="retirement">Retirement</option>
                <option value="investment">Investment</option>
                <option value="car">Car</option>
                <option value="education">Education</option>
                <option value="wedding">Wedding</option>
                <option value="health">Health</option>
                <option value="others">Others</option>
              </select>
            </div>

            <div>
              <label htmlFor="targetAmount" className="block text-sm font-medium mb-2">
                Target Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2">₹</span>
                <input
                  id="targetAmount"
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="balance" className="block text-sm font-medium mb-2">
                Balance
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2">₹</span>
                <input
                  id="balance"
                  type="number"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Goal
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default CreateSubModal;
