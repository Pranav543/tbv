"use client";

import Header from "@/app/components/header/Header";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { createPublicClient, http, pubKeyToAddress } from "viem";
import TBVProtocolABI from "./TBVProtocol.json";
import { createWalletClient, custom } from "viem";
import { approveToken } from "@/app/quickaccess/ApproveTokens";
import { parseUnits, parseEther } from "viem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatUnits } from "viem";
import { rskNetworkConfig, hederaNetworkConfig } from "@/app/utils/constants";

const publicRSKClient = createPublicClient({
  chain: {
    id: rskNetworkConfig.id, 
    rpcUrls: {
      public: rskNetworkConfig.rpcUrl, 
    },
  },
  transport: http(rskNetworkConfig.rpcUrl), // Passing RPC URL to http function
});

let walletRSKClient;
if (typeof window !== "undefined" && window.ethereum) {
  walletRSKClient = createWalletClient({
    chain: {
      id: rskNetworkConfig.id, 
      rpcUrls: {
        public: rskNetworkConfig.rpcUrl,
        websocket: rskNetworkConfig.rpcUrl, // WebSocket URL (optional)
      },
    },
    transport: custom(window.ethereum),
  });
}

const publicHederaClient = createPublicClient({
  chain: {
    id: hederaNetworkConfig.id, 
    rpcUrls: {
      public: hederaNetworkConfig.rpcUrl, 
    },
  },
  transport: http(hederaNetworkConfig.rpcUrl), // Passing RPC URL to http function
});

let walletHederaClient;
if (typeof window !== "undefined" && window.ethereum) {
  walletHederaClient = createWalletClient({
    chain: {
      id: hederaNetworkConfig.id, 
      rpcUrls: {
        public: hederaNetworkConfig.rpcUrl,
        websocket: hederaNetworkConfig.rpcUrl, // WebSocket URL (optional)
      },
    },
    transport: custom(window.ethereum),
  });
}

export default function TransactionRequestDetails({ params }) {
  const [transaction, setTransaction] = useState();
  const { address, isConnected, chain} = useAccount();
  const [buttonName, setbuttonName] = useState("");
  let activeTab = params?.activeTab ? params.activeTab : "queue";
  let publicClient = chain.id == 296 ? publicHederaClient : publicRSKClient;
  let walletClient = chain.id == 296 ? walletHederaClient : walletRSKClient;

  let contractAddress = chain.id == 296 ? hederaNetworkConfig.contractAddress : rskNetworkConfig.contractAddress

  const [isLoading, setIsLoading] = useState(false);

  const executeTransaction = async () => {
    setIsLoading(true);
    console.log(transaction.amount);
    try {
      const TransactionDetails = [
        transaction.TransactionId,
        transaction.senderAddress,
        transaction.receiverAddress,
        transaction.amount,
        transaction.tokenAddress !== ""
          ? transaction.tokenAddress
          : contractAddress,
        transaction.tokenName,
      ];

      let functionCalled = "";
      if (transaction.tokenAddress === "") {
        functionCalled = "transferNative";
      } else {
        functionCalled = "transferTokens";
        let approve = await approveToken(
          transaction.amount,
          transaction.tokenAddress,
          address,
          chain.id
        );
        console.log(approve);
      }

      const { request } = await publicClient.simulateContract({
        account: address,
        address: contractAddress,
        abi: TBVProtocolABI,
        functionName: functionCalled,
        args: [
          transaction.senderSignature,
          transaction.receiverSignature,
          TransactionDetails,
        ],
        ...(functionCalled === "transferNative"
          ? { value: transaction.amount }
          : {}),
        gasLimit: 3000000, // Specify the gas limit here
      });

      const execute = await walletClient.writeContract(request);
      const currentDate = new Date();

      if (execute) {
        const userData = {
          TransactionId: transaction.TransactionId, // This should be passed in the request to identify the transaction to update
          status: "completed",
          transectionDate: currentDate,
        };
        console.log(userData);
        try {
          console.log("entered into try block");
          let result = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}api/payment-completed`,
            {
              method: "PUT",
              body: JSON.stringify(userData),
              headers: {
                "Content-Type": "application/json", // This header is crucial for sending JSON data
              },
            }
          );
          const response = await result.json();
          // console.log(response.message);
        } catch (error) {
          console.error("Error signing transaction:", error);
          // throw error;
        }
        toast.success("Execution sucessfull");
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error("Execution failed");
      console.log(error);
    }
  };
  const signTransaction = async () => {
    try {
      setIsLoading(true);
      const client = createWalletClient({
        chain: {
          id: chain.id == 296 ? hederaNetworkConfig.id : rskNetworkConfig.id, 
          rpcUrls: {
            public: chain.id == 296 ? hederaNetworkConfig.rpcUrl : rskNetworkConfig.rpcUrl,
            websocket: chain.id == 296 ? hederaNetworkConfig.rpcUrl : rskNetworkConfig.rpcUrl, // WebSocket URL (optional)
          },
        },
        transport: custom(window ? window.ethereum : ""),
      });

      const amount = parseUnits(transaction.amount, transaction.decimlals);
      const signature = await client.signTypedData({
        account: address,
        domain: {
          name: "TBVProtocol",
          version: "1",
          chainId: chain.id == 296 ? "296" : "31",
          verifyingContract: contractAddress,
        },
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          signByReceiver: [
            { name: "id", type: "uint256" },
            { name: "sender", type: "address" },
            { name: "receiver", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "tokenName", type: "string" },
          ],
        },
        primaryType: "signByReceiver",
        message: {
          id: transaction.TransactionId,
          sender: transaction.senderAddress,
          receiver: transaction.receiverAddress,
          amount: amount,
          tokenName: transaction.tokenName,
        },
      });
      const currentDate = new Date();
      console.log("Signature:", signature);
      if (signature) {
        const userData = {
          TransactionId: transaction.TransactionId, // This should be passed in the request to identify the transaction to update
          receiverSignature: signature,
          status: "approved",
          approveDate: currentDate,
        };
        console.log(userData);
        try {
          console.log("entered into try block");
          let result = await fetch(
            `${process.env.NEXT_PUBLIC_APP_URL}api/store-transaction`,
            {
              method: "PUT",
              body: JSON.stringify(userData),
              headers: {
                "Content-Type": "application/json", // This header is crucial for sending JSON data
              },
            }
          );
          const response = await result.json();
          // console.log(response.message);
          setIsLoading(false);
          toast.success("Signed Sucessfully");
        } catch (error) {
          console.error("Error signing transaction:", error);
          setIsLoading(false);
          toast.error("Error while signing");
        }
      }
    } catch (error) {
      console.error("Error signing transaction:", error);
    }
  };

  const cancelTransaction = async () => {
    const currentDate = new Date();
    const userData = {
      TransactionId: transaction.TransactionId, // This should be passed in the request to identify the transaction to update
      receiverSignature: "rejection-no signature",
      status: "rejected",
      approveDate: currentDate,
    };
    console.log(userData);
    try {
      console.log("entered into try block");
      let result = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}api/store-transaction`,
        {
          method: "PUT",
          body: JSON.stringify(userData),
          headers: {
            "Content-Type": "application/json", // This header is crucial for sending JSON data
          },
        }
      );
      const response = await result.json();

      setIsLoading(false);
      toast.success("Rejected Sucessfully");
    } catch (error) {
      console.error("Error Rejecting transaction:", error);
      setIsLoading(false);
      toast.error("Error while rejecting transaction");
    }
  };

  useEffect(() => {
    if (address) {
      const fetchTransactions = async () => {
        const url = `/api/fetch-transaction?address=${address}&type=${activeTab}`;
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
            console.log(transactions, activeTab);
            if (
              transactions.status === "approved" &&
              transactions.receiverSignature !== "" &&
              transactions.senderSignature !== "" &&
              activeTab === "queue"
            ) {
              setbuttonName("Execute Transaction");
            } else if (
              transactions.status === "inititated" &&
              transactions.senderSignature !== "" &&
              transactions.receiverSignature === "" &&
              activeTab === "received"
            ) {
              setbuttonName("Sign Transaction");
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
                <label>ID:</label>
                <input
                  type="text"
                  className="text-black"
                  value={transaction?.TransactionId}
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
              <div className="w-full inputParent">
                {isLoading ? (
                  "Loading..."
                ) : buttonName === "Sign Transaction" ? (
                  <button
                    className="approveBtn"
                    onClick={() => signTransaction()}
                  >
                    {buttonName}
                  </button>
                ) : buttonName === "Execute Transaction" ? (
                  <button
                    className="approveBtn"
                    onClick={() => executeTransaction()}
                  >
                    {buttonName}
                  </button>
                ) : null}
              </div>
              <div>
                {" "}
                {activeTab !== "history" ? (
                  <button
                    className="approveBtn"
                    onClick={() => cancelTransaction()}
                  >
                    Cancel
                  </button>
                ) : null}
              </div>
            </div>
            {/* Add more fields as needed */}
            <ToastContainer />
          </div>
        </div>
      </div>
    </>
  );
}
