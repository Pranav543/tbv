"use client";
import React, { useEffect, useState } from "react";
import "./TransactionTypes.css";

import { useRouter } from "next/navigation";
import { useAccount, useBalance } from "wagmi";
import Queue from "./Types/Queue";
import Received from "./Types/Received";
import History from "./Types/History";
import InitiateTransaction from "./Modal/InitiateTransaction";

const TransactionTypes = () => {
  const { address } = useAccount();
  const [transactions, setTransaction] = useState([]);

  const [activeTab, setActiveTab] = useState("queue");

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (address) {
      const fetchTransactions = async () => {
        const url = `/api/fetch-transaction?address=${address}&type=${activeTab}`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          console.log(data);
          setTransaction(data);
          // Assuming the API returns a single transaction object
        } catch (error) {
          console.error("Failed to fetch transactions:", error);
        }
      };
      fetchTransactions();
    }
  }, [address, activeTab]);

  const balance = useBalance({
    address: address ? address : "",
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const renderComponent = (tab) => {
    switch (tab) {
      case "queue":
        return (
          <Queue
            transactions={transactions}
            address={address}
            activeTab={activeTab}
          />
        );

      // case "received":
      //   return (
      //     <Received
      //       transactions={transactions}
      //       address={address}
      //       activeTab={activeTab}
      //     />
      //   );
      case "history":
        return (
          <History
            transactions={transactions}
            address={address}
            activeTab={activeTab}
          />
        );
      default:
        return (
          <Queue
            transactions={transactions}
            address={address}
            activeTab={activeTab}
          />
        );
    }
  };

  return (
    <>
      <div>
        <div className="container-parent">
          <div className="flex items-center justify-between pb-[24px] px-[24px]">
            <h1 className="reqheader2">Transaction Requests</h1>
            <button className="initiateBtn button-50" onClick={openModal}>
              Initiate Request
            </button>
          </div>

          <div className="table-tabs w-full border-b border-[#dcdee0] px-[24px] pt-[24px]">
            <div className="flex justify-left space-x-4  ">
              <button
                className={`px-6 py-4  text-base font-bold ${
                  activeTab === "queue" ? "activeTabBtn" : "inactiveBtn"
                }`}
                onClick={() => handleTabChange("queue")}
              >
                Queue
              </button>
              {/* <button
                className={`px-4 py-2  text-base font-bold ${
                  activeTab === "received" ? "activeTabBtn" : "inactiveBtn"
                }`}
                onClick={() => handleTabChange("received")}
              >
                Received
              </button> */}
              <button
                className={`px-4 py-2  text-base font-bold ${
                  activeTab === "history" ? "activeTabBtn" : "inactiveBtn"
                }`}
                onClick={() => handleTabChange("history")}
              >
                History
              </button>
            </div>
          </div>
          <div className=" custom-container ">{renderComponent(activeTab)}</div>
        </div>
      </div>
      {isModalOpen && <InitiateTransaction onClose={closeModal} />}
    </>
  );
};

export default TransactionTypes;
