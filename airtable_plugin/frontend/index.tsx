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
            backgroundColor: "#8b6fe0",
            flexDirection: "row",
            display: "flex",
            marginBottom: "4px",
            marginTop: "4px",
            marginRight: "4px",
            marginLeft: "4px",
            height: "45px",
            padding: "7px",
            borderRadius: "4px",
          }}
        >
          <div
            style={{
              flex: 1,
              fontSize: "25px",
              // fontWeight: "bold",
              color: "white",
            }}
          >
            The Floo Network 🪄
          </div>
          <AirConnectButton />
        </div>
        {/* Body */}
        <div style={{ margin: "2px" }}>
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
