"use client";

import React, { useEffect, useState } from "react";
import "./InitiateTransaction.css";
import { getTokenDetails } from "@/app/quickaccess/getTokenDetails";
import { useAccount } from "wagmi";
import { formatUnits } from "viem";
import { createWalletClient, custom } from "viem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { parseUnits, parseEther } from "viem";
import { formSchemaLoadToken, formSchemaTransaction } from "./schema";
import LoadingSpinner from "./LoadingSpinner";
import {rskNetworkConfig, hederaNetworkConfig} from "./../../utils/constants"

const InitiateTransaction = ({ onClose }) => {
  const { address, isConnected, chain } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingToken, setisLoadingToken] = useState(false);
  const [errorDisplay, setErrorDisplay] = useState(false);
  const [errors, setErrors] = useState();
  const [errorLoadToken, setErrorLoadToken] = useState();
  const [transaction, setTransaction] = useState({
    sender: "",
    receiver: "",
    token: "",
    amount: "",
  });
  const [isERC20, setIsERC20] = useState(false);
  const defaultTokenDetails = {
    name: "",
    symbol: "",
    decimals: "",
    balance: "",
  };

  const chainCurrency = chain.id == 296 ? hederaNetworkConfig.currency : rskNetworkConfig.currency

  const [tokenDetails, setTokenDetails] = useState(defaultTokenDetails);

  // Handle onchange event for input fields and update the transaction state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransaction({ ...transaction, [name]: value });
  };

  const loadTokenDetails = async () => {
    setErrorDisplay(false);
    const formData = {
      token: transaction.token,
    };

    try {
      formSchemaLoadToken.parse(formData);
      setisLoadingToken(true);
      console.log(transaction.token, address);
      console.log(await getTokenDetails(transaction.token, chain.id));
      const getToken = await getTokenDetails(transaction.token, chain.id);
      console.log(getToken);
      if (getToken !== null) {
        setTokenDetails(getToken);
      }
    } catch (err) {
      console.log(err);
      setErrorLoadToken(err.formErrors?.fieldErrors?.token);
      setErrorDisplay(true);
    } finally {
      setisLoadingToken(false);
    }
  };

  useEffect(() => {
    if (!isERC20) {
      setTokenDetails(defaultTokenDetails);
      setTransaction({ ...transaction, ["token"]: "" });
    }
  }, [isERC20]);

  const handleCheckboxChange = () => {
    setIsERC20(!isERC20);
  };

  const signTransaction = async (e) => {
    e.preventDefault();
    // if (transaction.receiver === "" || transaction.amount === "") {
    //   console.log("Please Enter Details");
    //   return;
    // }

    setErrorDisplay(false);

    const formData = {
      receiver: transaction.receiver,
      amount: transaction.amount,
      token: isERC20 ? transaction.token : undefined,
    };

    const { ethereum } = window;
    if (!ethereum) {
      throw new Error("Metamask is not installed, please install!");
    }
    // let amount = parseUnits(transaction.amount, tokenDetails.decimals);
    console.log(transaction.amount);

    try {
      formSchemaTransaction.parse(formData);
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

      const url = `/api/latest-nonce?address=${address}`;

      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      let nonce = parseInt(data.nonce) + 1;
      var amount = transaction.amount;
      if (isERC20) {
        amount = parseUnits(transaction.amount, tokenDetails.decimals);
      } else {
        amount = parseEther(transaction.amount);
      }

      const signature = await client.signTypedData({
        account: address,
        domain: {
          name: "TBVProtocol",
          version: "1",
          chainId: chain.id == 296 ? "296" : "31",
          verifyingContract: chain.id == 296 ? hederaNetworkConfig.contractAddress : rskNetworkConfig.contractAddress,
        },
        types: {
          EIP712Domain: [
            { name: "name", type: "string" },
            { name: "version", type: "string" },
            { name: "chainId", type: "uint256" },
            { name: "verifyingContract", type: "address" },
          ],
          initiateTransaction: [
            { name: "nonce", type: "uint256" },
            { name: "sender", type: "address" },
            { name: "receiver", type: "address" },
            { name: "amount", type: "uint256" },
            { name: "tokenName", type: "string" },
          ],
        },
        primaryType: "initiateTransaction",
        message: {
          nonce: nonce,
          sender: address,
          receiver: transaction.receiver,
          amount: amount,
          tokenName: tokenDetails.symbol !== "" ? tokenDetails.symbol : chainCurrency,
        },
      });
      const currentDate = new Date();
      console.log("Signature:", signature);
      if (signature) {
        const userData = {
          senderAddress: address,
          receiverAddress: transaction.receiver,
          amount: amount.toString(),
          tokenAddress: transaction.token,
          senderSignature: signature,
          receiverSignature: "",
          status: "inititated",
          tokenName: tokenDetails.symbol !== "" ? tokenDetails.symbol : chainCurrency,
          initiateDate: currentDate,
          decimals: tokenDetails.symbol !== "" ? tokenDetails.decimals : 18,
          nonce: nonce,
        };
        console.log(userData);
        try {
          console.log("entered into try block");
          let result = await fetch(`api/store-transaction`, {
            method: "POST",
            body: JSON.stringify(userData),
          });
          const response = await result.json();
          console.log("Signed Sucessfully");
          toast.success("Signed Sucessfully");
          await new Promise((resolve) => setTimeout(resolve, 3000));
          setIsLoading(false);
          window.location.reload();
          onClose();
          // console.log(response.message);
        } catch (error) {
          toast.error("Error while signing");
          setIsLoading(false);
          console.error("Error signing transaction:", error);
          // throw error;
        }
      }
    } catch (err) {
      console.log(err.formErrors ? err.formErrors : err);
      setErrors(err.formErrors?.fieldErrors);
      setErrorDisplay(true);
      console.error("Error signing transaction:", err);

      // throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (transaction.receiver || transaction.token || transaction.amount) {
      setErrors({});
      setErrorDisplay(false);
    }

    return () => {
      setErrors({});
      setErrorDisplay(false);
    };
  }, [transaction.receiver, transaction.token, transaction.amount]);

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-card">
          <div className="closeIcon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
              onClick={onClose}
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z" />
            </svg>
          </div>
          <h1 className="send-transaction">Send Transaction</h1>

          <form
            className="mt-6 flex flex-col item-center justify-center w-full px-4"
            onSubmit={signTransaction}
          >
            <div className="w-full inputParent">
              <label>Receiver Address</label>
              <input
                type="text"
                name="receiver"
                placeholder="Enter Receiver's Address"
                className="text-black"
                value={transaction.receiver || ""}
                onChange={handleInputChange}
                style={{
                  border:
                    errorDisplay && errors?.receiver ? "1px solid red" : "",
                }}
              />
              {errorDisplay && errors?.receiver && (
                <span className="text-red text-left mt-2 text-sm">
                  *{errors.receiver}
                </span>
              )}
            </div>

            <div className="w-full inputParent">
              <label>Type:</label>
              <div
                className="flex items-center cursor-pointer inputDiv"
                onClick={handleCheckboxChange}
              >
                <input
                  type="checkbox"
                  checked={isERC20}
                  className="form-checkbox h-5 w-5 text-indigo-600"
                />
                <span className="ml-2 checkmark text-black">
                  Send ERC-20 Token
                </span>
              </div>
            </div>

            {isERC20 && (
              <>
                <div className="w-full inputParent">
                  <label>Token:</label>
                  <input
                    type="text"
                    name="token"
                    placeholder="Enter Token Address"
                    className="text-black"
                    value={transaction.token || ""}
                    onChange={handleInputChange}
                    style={{
                      border:
                        errorDisplay && errorLoadToken ? "1px solid red" : "",
                    }}
                  />
                  {errorDisplay && errorLoadToken && (
                    <span className="text-red text-left mt-2 text-sm">
                      *{errorLoadToken}
                    </span>
                  )}
                </div>
                {isLoadingToken ? (
                  <>
                    <button className="load-token">
                      <LoadingSpinner />
                      Loading...
                    </button>
                  </>
                ) : (
                  <button
                    onClick={loadTokenDetails}
                    className="load-token button-50"
                    type="button"
                  >
                    Load Token
                  </button>
                )}
              </>
            )}
            {transaction.token && tokenDetails.name && (
              <div className="token-details text-left flex flex-col px-4">
                <span className="text-slate-600 text-base my-4 ">
                  Name:{" "}
                  <span className="text-black text-xl font-bold">
                    {tokenDetails.name}
                  </span>{" "}
                </span>
                <span className="text-slate-600 text-base my-4">
                  Symbol:{" "}
                  <span className="text-black text-xl font-bold">
                    {tokenDetails.symbol}
                  </span>
                </span>
                <span className="text-slate-600 text-base my-4">
                  Total Balance:{" "}
                  <span className="text-black text-xl font-bold">
                    {tokenDetails.balance
                      ? `${formatUnits(
                          tokenDetails.balance,
                          tokenDetails.decimals
                        )} ${tokenDetails.symbol}`
                      : null}
                  </span>
                </span>
              </div>
            )}

            <div className="w-full inputParent">
              <label>Amount:</label>
              <input
                type="text"
                name="amount"
                placeholder="Enter Amount"
                className="text-black"
                value={transaction.amount || ""}
                onChange={handleInputChange}
                style={{
                  border: errorDisplay && errors?.amount ? "1px solid red" : "",
                }}
              />
              {errorDisplay && errors?.amount && (
                <span className="text-red text-left mt-2 text-sm">
                  *{errors.amount}
                </span>
              )}
            </div>
            <ToastContainer />

            <div className="w-full inputParent">
              {isLoading ? (
                <button className="sendReqBtn disabled">
                  <LoadingSpinner /> Loading...
                </button>
              ) : (
                <button className="sendReqBtn button-50" type="submit">
                  Send
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InitiateTransaction;
