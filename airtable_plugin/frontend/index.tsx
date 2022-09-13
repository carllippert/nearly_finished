import { initializeBlock, useBase, useRecords } from "@airtable/blocks/ui";
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
import { JobItem } from "./JobItem";

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
  const base = useBase();
  const table = base.getTableByName("Jobs");
  const records = useRecords(table);

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        {/* <Box style={{ backgroundColor: "pink" }}> */}
        {/* Header */}
        <div
          style={{
            // backgroundColor: "pink",
            flexDirection: "row",
            display: "flex",
            marginBottom: "4px",
            marginTop: "2px",
            marginRight: "2px",
          }}
        >
          <div style={{ flex: 1 }}></div>
          <AirConnectButton />
        </div>
        {/* Body */}
        <div>
          {records.map((record) => {
            return <JobItem key={record.id} record={record} />;
            // return <div>{record.name}</div>;
          })}
        </div>
        {/* </Box> */}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

initializeBlock(() => <HelloWorldTypescriptApp />);
