import React, { useState, useEffect, useRef } from "react";
import { MoreVertical } from "lucide-react";
import AllocateFunds from "../modals/subaccount/AllocateFunds";
import WithdrawFunds from "../modals/subaccount/WithdrawFunds";
function SubAccountCard({ account, onTransferClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const progress = Math.min(
    (account.balance / account.targetAmount) * 100,
    100
  );

  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  const openAllocateModal = () => {
    setShowAllocateModal(true);
    setMenuOpen(false);
  };

  const openWithdrawModal = () => {
    setShowWithdrawModal(true);
    setMenuOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {account.name}
              </h3>
              <p className="text-sm text-gray-500">{account.description}</p>
            </div>
          </div>
          <div className="relative" ref={menuRef}>
            <button
              className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-lg transition-all"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <MoreVertical className="w-4 h-4 text-gray-400" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border z-50">
                <ul className="text-sm text-gray-700">
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      onTransferClick(account); // 👈 send selected account to parent
                      setMenuOpen(false);
                    }}
                  >
                    Transfer Funds
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={openWithdrawModal}
                  >
                    Withdraw
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={openAllocateModal}
                  >
                    Allocate
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-semibold text-gray-900">
              {progress.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all bg-blue-500 duration-500 ease-out"
              style={{
                width: `${Math.min(progress, 100)}%`,
              }}
            />
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 leading-snug">
            ₹{account.balance.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500">
            of ₹{account.targetAmount.toLocaleString()} goal
          </p>
        </div>
      </div>
      {showAllocateModal && (
        <AllocateFunds
          account={account}
          onClose={() => setShowAllocateModal(false)}
        />
      )}
      {showWithdrawModal && (
        <WithdrawFunds
          account={account}
          onClose={() => setShowWithdrawModal(false)}
        />
      )}
    </>
  );
}

export default SubAccountCard;
