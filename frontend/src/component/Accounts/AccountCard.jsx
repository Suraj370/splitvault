import React, { useState } from "react";
import DepositModal from "../modals/accounts/DepositModal";
import WithdrawModal from "../modals/accounts/WithdrawModal";
import { Link } from "react-router-dom";

function AccountCard({ data }) {
  const [showDepositModal, setDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const handleDepostModal = (e) => {
    e.stopPropagation(); // prevent bubbling to Link
    setDepositModal(true);
  };
  const handleWithdrawModal = (e) => {
    e.stopPropagation(); // prevent bubbling to Link
    setShowWithdrawModal(true);
  };


  return (
    <>
      <div className="w-full rounded-3xl p-6 text-white bg-indigo-600/80 relative overflow-hidden shadow-md hover:shadow-xl transition duration-300">
        <Link to={`/accounts/${data.id}`} className="block">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold">{data.name}</h2>
            <span className="text-xs ">#{data.id.slice(-6)}</span>
          </div>

          <div className="flex items-center gap-2 text-3xl font-semibold ">
            ₹{data.balance.toLocaleString("en-IN")}
          </div>

          <div className="text-xs  mt-1">
            Created on:{" "}
            {new Date(data.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </Link>

        <div className="mt-4 flex items-center space-x-4">
          <button
            onClick={handleWithdrawModal}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
          >
            Withdraw
          </button>
          <button
            onClick={handleDepostModal}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
          >
            Deposit
          </button>
        </div>

        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 bg-white"></div>
      </div>

      {showDepositModal && <DepositModal account={data} onClose={() => setDepositModal(false)} />}
      {showWithdrawModal && (
        <WithdrawModal account={data} onClose={() => setShowWithdrawModal(false)} />
      )}
    </>
  );
}

export default AccountCard;
