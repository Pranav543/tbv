"use client";
import React, { useState } from "react";
import "./singletxexpanded.css";
import { formatUnits } from "viem";
import AddressWithCopy from "../quickaccess/AddressWithCopy";
import Blockies from "react-blockies";
import { useAccount } from "wagmi";

function SingleTranscationAccordianExpanded({
  transaction,
  cancelTransaction,
  isLoading,
  index,
  selectedIndex,
  isRejectedBtn,
  handleActionButtonClick,
}) {
  const { address } = useAccount();

  return (
    <>
      <div className="expanded-single-tx-parent">
        <div className="left">
          <div className="left-child">
            <div className="expaned-left-top">
              <div
                style={{
                  textAlign: "left",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                Send
                <span style={{ fontWeight: "700", marginLeft: "5px" }}>
                  {formatUnits(transaction.amount, transaction.decimals)}
                  <span style={{ marginLeft: "5px", marginRight: "5px" }}>
                    {transaction.tokenName}
                  </span>
                </span>
                to:
              </div>
              <div style={{ marginTop: "10px", marginBottom: "20px" }}>
                <div className="table-user">
                  <Blockies
                    className="table-user-gradient"
                    seed={
                      transaction.receiverAddress
                        ? transaction.receiverAddress
                        : null
                    }
                    size={10}
                    scale={3}
                  />
                  <div className="table-user-details">
                    <AddressWithCopy
                      address={transaction.receiverAddress}
                      short={true}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="expaned-left-bottom">
              <div className="lables">
                <div className="lable">Nonce:</div>
                <div className="lable">Transaction Hash:</div>
                <div className="lable">Initiated Date:</div>
                <div className="lable">Status:</div>

                <div className="lable">Sender:</div>
              </div>
              <div className="values">
                <div className="value">{transaction.nonce}</div>
                <div className="value">
                  {transaction.transactionHash ? (
                    <a
                      href={`https://testnet.bttcscan.com/tx/${transaction.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      txHash
                    </a>
                  ) : (
                    "awaiting tx hash"
                  )}
                </div>
                <div className="value">{transaction.initiateDate}</div>
                <div className="value">{transaction.status}</div>
                <div className="value">
                  <div className="table-user">
                    <Blockies
                      className="table-user-gradient"
                      seed={
                        transaction.senderAddress
                          ? transaction.senderAddress
                          : null
                      }
                      size={10}
                      scale={3}
                    />
                    <div className="table-user-details">
                      <AddressWithCopy
                        address={transaction.senderAddress}
                        short={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="right">
          <div className="process">
            <ul>
              <li
                className={`step ${
                  transaction.status === "inititated" ||
                  transaction.status === "approved" ||
                  transaction.status === "completed" ||
                  transaction.status === "rejected"
                    ? "completed"
                    : null
                }`}
              >
                <div className="name">Request Initiated</div>
              </li>
              <li
                className={`step ${
                  transaction.status === "inititated" ? "current" : null
                } ${
                  transaction.status === "approved" ||
                  transaction.status === "completed"
                    ? "completed"
                    : null
                }`}
              >
                <div className="name">
                  {transaction.status === "approved" ||
                  transaction.status === "completed"
                    ? "Approved"
                    : "Waiting for Receiver's Approval"}
                </div>
              </li>
              <li
                className={`step ${
                  transaction.status === "approved" ? "current" : null
                } ${transaction.status === "completed" ? "completed" : null}`}
              >
                <div className="name">
                  {transaction.status === "approved" ||
                  transaction.status === "inititated" ||
                  transaction.status === "rejected"
                    ? "Waiting for Sender to Execute"
                    : transaction.status === "completed"
                    ? "Executed"
                    : null}
                </div>
              </li>
              <li
                className={`step ${
                  transaction.status === "rejected" ||
                  transaction.status === "completed"
                    ? "completed"
                    : null
                }`}
              >
                <div className="name">
                  {transaction.status === "rejected" ? "Rejected" : "Completed"}
                </div>
              </li>
            </ul>
          </div>

          <div className="action-btns-expanded">
            {transaction.status === "rejected" ? (
              <button className="rejected-action-btn action-btn">
                Rejected
              </button>
            ) : transaction.status === "completed" ? (
              <button className="completed-action-btn action-btn">
                Completed
              </button>
            ) : (
              <>
                <button
                  className={
                    address &&
                    transaction.senderAddress === address &&
                    transaction.status === "inititated"
                      ? "waiting-action-btn action-btn"
                      : transaction.senderAddress === address &&
                        transaction.status === "approved"
                      ? "execute-action-btn action-btn"
                      : transaction.receiverAddress === address &&
                        transaction.status === "inititated"
                      ? "execute-action-btn action-btn"
                      : "waiting-action-btn action-btn"
                  }
                  onClick={() => handleActionButtonClick(transaction, index)}
                >
                  {isLoading &&
                  isRejectedBtn !== index &&
                  selectedIndex === index
                    ? "Loading..."
                    : address &&
                      transaction.senderAddress === address &&
                      transaction.status === "inititated"
                    ? "Waiting"
                    : transaction.senderAddress === address &&
                      transaction.status === "approved"
                    ? "Execute"
                    : transaction.receiverAddress === address &&
                      transaction.status === "inititated"
                    ? "Approve"
                    : transaction.status === "rejected"
                    ? "Rejected"
                    : "waiting"}
                </button>
                <button
                  className="rejected-action-btn action-btn"
                  onClick={() => cancelTransaction(transaction, index)}
                >
                  {isLoading && isRejectedBtn === index
                    ? "Loading..."
                    : "Reject"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SingleTranscationAccordianExpanded;
