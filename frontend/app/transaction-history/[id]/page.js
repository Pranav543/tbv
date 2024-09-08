"use client";

import Header from "@/app/components/header/Header";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { createPublicClient, http, pubKeyToAddress } from "viem";
import handshakeABI from "./Handshake.json";
import { createWalletClient, custom } from "viem";
import { approveToken } from "@/app/quickaccess/ApproveTokens";
import { parseUnits, parseEther } from "viem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatUnits } from "viem";

const publicClient = createPublicClient({
  chain: {
    id: 31, // BTTC Donau testnet chain ID
    rpcUrls: {
      public: "https://public-node.testnet.rsk.co/", // BTTC Donau testnet RPC URL
    },
  },
  transport: http("https://public-node.testnet.rsk.co/"), // Passing RPC URL to http function
});
const walletClient = createWalletClient({
  chain: {
    id: 31, // BTTC Donau testnet chain ID
    rpcUrls: {
      public: "https://public-node.testnet.rsk.co/",
      websocket: "https://public-node.testnet.rsk.co/", // WebSocket URL (optional)
    },
  },
  transport: custom(window ? window.ethereum : ""),
});

export default function TransactionRequestDetails({ params }) {
  const [transaction, setTransaction] = useState();
  const { address, isConnected } = useAccount();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (address) {
      const fetchTransactions = async () => {
        const url = `/api/fetch-transaction?address=${address}&type=history`;
        try {
          const response = await fetch(url);
          const data = await response.json();
          console.log(data);
          if (data) {
            console.log(params?.id);
            let id = params?.id ? params.id : 0;
            // console.log(transaction);
            const transactions = data.find(
              (transaction) => transaction.TransactionId == id
            );

            if (
              transactions.status === "approved" &&
              transactions.receiverSignature !== "" &&
              transactions.senderSignature !== ""
            ) {
              setButtonActive(false);
            }

            setTransaction(transactions);
            if (!transactions) {
              // Handle case when transaction is not found
              return <div>Transaction not found</div>;
            }
          }
        } catch (error) {
          console.error("Failed to fetch transaction:", error);
        }
      };
      fetchTransactions();
    }
  }, [address]);

  return (
    <>
      <Header />
      <div className="container-parent">
        <h1 className="reqheader">Transaction Details</h1>
        <div className="container">
          <div className="modal-content2">
            <div className="my-6 flex flex-col item-center justify-center w-full">
              <div className="w-full inputParent">
                <label>Nonce:</label>
                <input
                  type="text"
                  className="text-black"
                  value={transaction?.nonce}
                  readOnly
                />
              </div>
              <div className="w-full inputParent">
                <label>Sender:</label>
                <input
                  type="text"
                  className="text-black"
                  value={transaction?.senderAddress}
                  readOnly
                />
              </div>
              <div className="w-full inputParent">
                <label>Receiver:</label>
                <input
                  type="text"
                  className="text-black"
                  value={transaction?.receiverAddress}
                  readOnly
                />
              </div>
              <div className="w-full inputParent">
                <label>Token:</label>
                <input
                  type="text"
                  className="text-black"
                  value={transaction?.tokenName}
                  readOnly
                />
              </div>
              <div className="w-full inputParent">
                <label>Amount:</label>
                {transaction ? (
                  <input
                    type="text"
                    className="text-black"
                    value={formatUnits(
                      transaction?.amount,
                      transaction?.decimals
                    )}
                    readOnly
                  />
                ) : null}
              </div>
              <div className="w-full inputParent">
                <label>Date:</label>
                <input
                  type="text"
                  className="text-black"
                  value={transaction?.initiateDate}
                  readOnly
                />
              </div>
            </div>

            <ToastContainer />
          </div>
        </div>
      </div>
    </>
  );
}
