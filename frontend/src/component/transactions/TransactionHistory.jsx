import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSubAccountsTransactions } from "../../api/subaccounts.api";
import { Calendar } from "lucide-react";
function TransactionHistory({ account }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["subAccountsTransactions", account.id],
    queryFn: () => fetchSubAccountsTransactions(account.id),
    enabled: !!account.id,
  });
  console.log(data);
  

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading transactions</div>;

  const formatAmount = (amount, type) => {
    const prefix = type === "ALLOCATION" ? "+" : "-";
    return `${prefix}$${amount.toLocaleString()}`;
  };

  const getAmountColor = (type) => {
    switch (type) {
      case "ALLOCATION":
        return "text-green-600";
      case "WITHDRAWAL":
      case "TRANSFER":
        return "text-red-600";
      default:
        return "text-gray-900";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
      </div>
      <div className=" space-y-4">
        {data.transactions.slice(0, 8).map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div>
                <p className="font-medium text-gray-900">
                  {transaction.description?.trim()
                    ? transaction.description
                    : "No Description"}
                </p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{transaction.subAccount.name}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-semibold  ${getAmountColor(transaction.type)}`}
              >
                {formatAmount(transaction.amount, transaction.type)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionHistory;
