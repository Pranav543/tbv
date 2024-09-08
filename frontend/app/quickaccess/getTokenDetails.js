import { createPublicClient, http, pubKeyToAddress } from "viem";
import erc20Abi from "./ERC20ABI.json";
import { getContract } from "viem";
const publicClient = createPublicClient({
  chain: {
    id: 31, // BTTC Donau testnet chain ID
    rpcUrls: {
      public: "https://public-node.testnet.rsk.co/", // BTTC Donau testnet RPC URL
    },
  },
  transport: http("https://public-node.testnet.rsk.co/"), // Passing RPC URL to http function
});

export async function getTokenDetails(TokenAddress) {
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
