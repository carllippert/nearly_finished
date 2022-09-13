import React, { useEffect, useState } from "react";
import {
  usePrepareContractWrite,
  useContractWrite,
  useAccount,
  useBlockNumber,
  useSigner,
} from "wagmi";
import { AURORA_FLOO_ABI } from "./AuroraFlooAbi";
import { formatUnits, parseUnits, parseEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";

const contract_address = "0xC025Ac15557a11cc614d1Cf725dB18aeDdf1cFC5";

export const JobItem = ({ record }) => {
  const [hydrated, setHydrated] = useState(false);
  const { address, isConnecting, isDisconnected } = useAccount();
  const { data: signer } = useSigner();

  const { data: blockStamp } = useBlockNumber();
  //on first hit
  useEffect(() => {
    console.log("hydated");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      // alert("Changed Record");
      mint();
    }
  }, [record.getCellValue("stateString")]);

  // const { config } = usePrepareContractWrite({
  //   addressOrName: contract_address,
  //   contractInterface: AURORA_FLOO_ABI.abi,
  //   functionName: "mintTo",
  // });

  // mode: 'recklesslyUnprepared',
  //   addressOrName: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
  //     contractInterface: wagmigotchiABI,
  //       functionName: 'feed',

  const { data, isLoading, isSuccess, writeAsync } = useContractWrite({
    mode: 'recklesslyUnprepared',
    addressOrName: contract_address,
    contractInterface: AURORA_FLOO_ABI.abi,
    functionName: "mintTo",
  });
  

  const mint = async () => {
    try {
      const ethExecFee = parseEther("0.0001");
      const ethRecruiterFee = parseEther("0.0001");
      const ethCreatorFee = parseEther("0.0001");
      const deadline = blockStamp + 1000;

      let payment = BigNumber.from(ethExecFee)
        .add(BigNumber.from(ethCreatorFee))
        .add(BigNumber.from(ethRecruiterFee));

      const stuff = await writeAsync({
        args: [
          address, //creator
          address, //receiver
          "Test String About The NFT. In Future a URL to JSON", //tokenuri
          ethExecFee,
          ethRecruiterFee,
          ethCreatorFee,
          deadline,
        ],
        overrides: { value: payment },
      });

      console.log("Stuff" + JSON.stringify(stuff));
    } catch (e) {
      console.log("Error" + JSON.stringify(e));
      throw Error(e);
    }
  };

  return <div>{record.name}</div>;
};
