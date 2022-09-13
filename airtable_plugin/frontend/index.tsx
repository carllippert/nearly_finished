import { initializeBlock } from "@airtable/blocks/ui";
import React from "react";
import { Chain } from "wagmi";

import "@rainbow-me/rainbowkit/styles.css";

import { AirConnectButton } from "./AirtableConnectButton";
import {
  getDefaultWallets,
  RainbowKitProvider,
  // ConnectButton,
} from "@rainbow-me/rainbowkit";

import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";


const AURORA_TESTNET: Chain = {
  ...chain.localhost,
  id: 1313161555,
  name: "Aurora Testnet",
};

const { chains, provider } = configureChains(
  [AURORA_TESTNET],
  [
    // infuraProvider({ apiKey: process.env.INFURA_ID }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "Nearly Finished",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function HelloWorldTypescriptApp() {
  // YOUR CODE GOES HERE
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <div>Hello world 🚀</div>
        <AirConnectButton />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

initializeBlock(() => <HelloWorldTypescriptApp />);
