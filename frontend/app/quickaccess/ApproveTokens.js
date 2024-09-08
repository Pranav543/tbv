"use client";
import { createPublicClient, http, pubKeyToAddress } from "viem";
import erc20Abi from "./ERC20ABI.json";
import { createWalletClient, custom } from "viem";

const publicClient = createPublicClient({
  chain: {
    id: 31, 
    rpcUrls: {
      public: "https://public-node.testnet.rsk.co/", 
    },
  },
  transport: http("https://public-node.testnet.rsk.co/"), // Passing RPC URL to http function
});

let walletClient;
if (typeof window !== "undefined" && window.ethereum) {
  walletClient = createWalletClient({
    chain: {
      id: 31, 
      rpcUrls: {
        public: "https://public-node.testnet.rsk.co/",
        websocket: "https://public-node.testnet.rsk.co/", // WebSocket URL (optional)
      },
    },
    transport: custom(window.ethereum),
  });
}
export const approveToken = async (amount, tokenContractAddress, address) => {
  // First, read the current allowance
  const allowance = await readAllowance(tokenContractAddress, address);
  console.log(allowance);
  // Check if the current allowance is sufficient
  if (allowance >= amount) {
    // Already approved for the desired amount, return success
    return { success: true, message: `Already approved ${amount} tokens` };
  }

  // If not enough allowance, proceed to approve
  const { request } = await publicClient.simulateContract({
    account: address,
    address: tokenContractAddress,
    abi: erc20Abi.abi,
    functionName: "approve",
    args: ["0x8B91bc1451cE991C3CE01dd24944FcEcbecAEE36", amount],
  });

  const execute = await walletClient.writeContract(request);
  console.log(execute);
  if (execute) {
    await publicClient.waitForTransactionReceipt({ hash: execute });
  } else {
    throw new Error("Transaction hash is undefined");
  }
  console.log("hello");

  // Handle the execution result if needed
  if (execute) {
    return { success: true, message: `Approved ${amount} tokens successfully` };
  } else {
    return { success: false, message: `Approval failed` };
  }
};

// Helper function to read allowance
const readAllowance = async (tokenContractAddress, ownerAddress) => {
  const { result } = await publicClient.simulateContract({
    account: ownerAddress,
    address: tokenContractAddress,
    abi: erc20Abi.abi,
    functionName: "allowance",
    args: [ownerAddress, "0x8B91bc1451cE991C3CE01dd24944FcEcbecAEE36"],
  });

  return result;
};
