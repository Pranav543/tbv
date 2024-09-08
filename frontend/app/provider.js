"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  getDefaultWallets,
  getDefaultConfig,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import {
  argentWallet,
  trustWallet,
  ledgerWallet,
} from "@rainbow-me/rainbowkit/wallets";
import {
  arbitrum,
  base,
  mainnet,
  optimism,
  polygon,
  sepolia,
  bitTorrentTestnet,
} from "wagmi/chains";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { useEffect } from "react";

const { wallets } = getDefaultWallets();

const rskchainTestnet = {
  id: 31,
  name: "RootStock Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "RootStock Testnet",
    symbol: "tRBTC",
  },
  rpcUrls: {
    default: { http: ["https://public-node.testnet.rsk.co/"] },
  },
  blockExplorers: {
    default: { name: "rootstock tesnet scan", url: "https://explorer.testnet.rsk.co/" },
  },
  testnet: true,
};

const config = getDefaultConfig({
  appName: "TBV Protocol",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  wallets: [
    ...wallets,
    {
      groupName: "Other",
      wallets: [argentWallet, trustWallet, ledgerWallet],
    },
  ],
  chains: [
    rskchainTestnet,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [sepolia] : []),
  ],
  ssr: true,
});

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
