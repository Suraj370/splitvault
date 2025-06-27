import React, { useState } from "react";
import { useParams } from "react-router";
import { fetchAccountById } from "../api/accounts.api";
import BalanceOverview from "../component/accountdetails/BalanceOverview";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import SubAccountCard from "../component/subaccounts/SubAccountCard";
import TransferFunds from "../component/modals/subaccount/TransferFunds";
import CreateSubModal from "../component/modals/subaccount/CreateSubModal";
import TransactionHistory from "../component/transactions/TransactionHistory";

function AccountDetails() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["account", id],
    queryFn: () => fetchAccountById(id),
    enabled: !!id,
  });

  const [showModal, setShowModal] = useState(false);

  const handleAddClick = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedSubAccount, setSelectedSubAccount] = useState(null);

  const handleTransferClick = (subAccount) => {
    setSelectedSubAccount(subAccount);
    setShowTransferModal(true);
  };

  const closeTransferModal = () => {
    setShowTransferModal(false);
    setSelectedSubAccount(null);
  };

  const subAccounts = data?.subAccounts || [];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading account</div>;
  return (
    <div className="max-w-7xl mx-auto px-6 py-7">
      <BalanceOverview account={data} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Savings Goals - {data.name}
            </h2>
            <button
              onClick={() => {
                handleAddClick();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Add New Goal
            </button>
          </div>
          {subAccounts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subAccounts.map((account) => (
                <SubAccountCard
                  key={account.id}
                  account={account}
                  onTransferClick={handleTransferClick}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              {" "}
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No savings goals yet
              </h3>
              <p className="text-gray-500 mb-6">
                Create your first savings goal to start tracking your progress.
              </p>
              <button
                onClick={() => handleAddClick()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Create Your First Goal
              </button>
            </div>
          )}
          <div></div>
        </div>
        <div className="lg:col-span-1">
          <TransactionHistory account={data} />
        </div>
      </div>
      {showModal && <CreateSubModal account={data} onClose={handleClose} />}
      {showTransferModal && selectedSubAccount && (
        <TransferFunds
          account={selectedSubAccount}
          subAccounts={subAccounts}
          onClose={closeTransferModal}
        />
      )}
    </div>
  );
}

export default AccountDetails;
