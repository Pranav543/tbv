"use client";
import { createPublicClient, http, pubKeyToAddress } from "viem";
import erc20Abi from "./ERC20ABI.json";
import { createWalletClient, custom } from "viem";
import { rskNetworkConfig, hederaNetworkConfig } from "../utils/constants";

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

export const approveToken = async (
  amount,
  tokenContractAddress,
  address,
  chainId
) => {
  let publicClient = chainId == 296 ? publicHederaClient : publicRSKClient;
  let walletClient = chainId == 296 ? walletHederaClient : walletRSKClient;
  // First, read the current allowance
  const allowance = await readAllowance(tokenContractAddress, address, chainId);
  console.log(allowance);
  // Check if the current allowance is sufficient
  if (allowance >= amount) {
    // Already approved for the desired amount, return success
    return { success: true, message: `Already approved ${amount} tokens` };
  }

  let contractAddress = chainId == 296 ? hederaNetworkConfig.contractAddress : rskNetworkConfig.contractAddress


  // If not enough allowance, proceed to approve
  const { request } = await publicClient.simulateContract({
    account: address,
    address: tokenContractAddress,
    abi: erc20Abi.abi,
    functionName: "approve",
    args: [contractAddress, amount],
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
const readAllowance = async (tokenContractAddress, ownerAddress, chainId) => {
  let publicClient = chainId == 296 ? publicHederaClient : publicRSKClient;
  let contractAddress = chainId == 296 ? hederaNetworkConfig.contractAddress : rskNetworkConfig.contractAddress
  const { result } = await publicClient.simulateContract({
    account: ownerAddress,
    address: tokenContractAddress,
    abi: erc20Abi.abi,
    functionName: "allowance",
    args: [ownerAddress, contractAddress],
  });

  return result;
};
