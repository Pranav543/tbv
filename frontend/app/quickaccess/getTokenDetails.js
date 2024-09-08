import { createPublicClient, http, pubKeyToAddress } from "viem";
import erc20Abi from "./ERC20ABI.json";
import { getContract } from "viem";
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

const publicHederaClient = createPublicClient({
  chain: {
    id: hederaNetworkConfig.id, 
    rpcUrls: {
      public: hederaNetworkConfig.rpcUrl, 
    },
  },
  transport: http(hederaNetworkConfig.rpcUrl), // Passing RPC URL to http function
});

export async function getTokenDetails(TokenAddress, chainId) {
  let publicClient = chainId == 296 ? publicHederaClient : publicRSKClient;
  try {
    const contract = getContract({
      address: TokenAddress,
      abi: erc20Abi.abi,
      client: publicClient,
    });
    const name = await contract.read.name();
    const symbol = await contract.read.symbol();
    const decimals = await contract.read.decimals();
    const balance = await contract.read.balanceOf([
      "0xF0F21D6AAc534345E16C2DeE12c3998A4e32e789",
    ]);
    console.log(balance);
    return {
      name,
      symbol,
      decimals: decimals.toString(),
      balance: balance,
    };
  } catch (error) {
    console.log("loading token error", error.message);
    return null;
  }
}
