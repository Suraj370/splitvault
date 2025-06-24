import React, { useState } from "react";
import DepositModal from "./DepositModal";

function AccountCard({ data, key }) {
  const [showModal, setShowModal] = useState(false);

  const handleDepositClick = () => setShowModal(true);
  const handleClose = () => setShowModal(false);




  return (
    <>
      <div  className={` w-full rounded-3xl p-6 text-white bg-indigo-600/80 relative overflow-hidden shadow-md hover:shadow-xl transition duration-300`}>
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

        <div className="mt-4">
          <button
            onClick={handleDepositClick}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-xl transition duration-200"
          >
            Deposit
          </button>
        </div>
        <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full opacity-10 bg-white"></div>
      </div>

      {showModal && (
        <DepositModal
          account={data}
          onClose={handleClose}
        />
      )}
    </>
  );
}

export default AccountCard;
