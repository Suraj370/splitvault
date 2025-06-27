import React from "react";
import { DollarSign, PiggyBank, TrendingUp } from "lucide-react";
function BalanceOverview({ account }) {
  const savings =
    account?.subAccounts?.reduce((sum, sub) => sum + sub.balance, 0) ?? 0;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div
        className="rounded-xl p-6 text-white relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgb(59, 130, 246) 0%, rgba(59, 130, 246, 0.8) 100%)",
        }}
      >
        <div className="flex items-center justify-between mb-4 relative z-10">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-6 h-6" />
            <h3 className="font-semibold">Total Balance</h3>
          </div>
          <TrendingUp className="w-5 h-5 opacity-80" />
        </div>
        <p className="text-3xl font-bold mb-2 relative z-10">
          ₹{(account.balance + savings).toLocaleString()}
        </p>
        <p className="opacity-90 text-sm relative z-10">{account.name}</p>
        <div
          className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10"
          style={{ backgroundColor: "white" }}
        />
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <PiggyBank className="w-6 h-6 text-green-600" />
            <h3 className="font-semibold text-gray-900">Total Saved</h3>
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-2">
          ₹{savings.toLocaleString()}
        </p>
        <p className="text-gray-500 text-sm">Across all sub accounts</p>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-gray-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Available</h3>
          </div>
        </div>
        <p className="text-3xl font-bold text-gray-900 mb-2">
          ₹{account.balance.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default BalanceOverview;
