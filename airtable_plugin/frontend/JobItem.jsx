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
import { Box } from "@airtable/blocks/ui";

const contract_address = "0xaFa1610e6F9CD639004a017eDBDd2685d0a8406E";

export const JobItem = ({ record }) => {
  const [hydrated, setHydrated] = useState(false);
  const { address, isConnecting, isDisconnected } = useAccount();
  // const { data: signer } = useSigner();

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

  const { data, isLoading, isSuccess, writeAsync, write } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: contract_address,
    contractInterface: AURORA_FLOO_ABI.abi,
    functionName: "mintTo",
  });

  const mint = async () => {
    try {
      const ethExecFee = parseUnits(String(record.getCellValue("exec_fee_eth")));
      console.log("ethExecFee " + ethExecFee);
      const ethRecruiterFee = parseUnits(String(record.getCellValue("rec_fee_eth")));
      console.log("ethRecruiterFee " + ethRecruiterFee);
      const ethCreatorFee = parseUnits(String(record.getCellValue("creator_fee_eth")))
      console.log("ethCreatorFee " + ethCreatorFee);
      const deadline = Date.now() + 1000;

      console.log("deadline =>" + deadline);

      let payment = BigNumber.from(ethExecFee)
        .add(BigNumber.from(ethCreatorFee))
        .add(BigNumber.from(ethRecruiterFee));

      console.log("Payment" + JSON.stringify(payment));

      const blob = {
        args: [
          address, //creator
          address, //receiver
          "https://ctinsvafusekcbpznpfr.supabase.co/storage/v1/object/public/nft-metadata/metadata.json", //tokenuri
          ethExecFee,
          ethRecruiterFee,
          ethCreatorFee,
          deadline,
        ],
        overrides: { value: payment },
      };

      console.log("Blob => " + JSON.stringify(blob));

      const stuff = await writeAsync(blob);

      console.log("Stuff" + JSON.stringify(stuff));
    } catch (e) {
      console.log("Error" + JSON.stringify(e));
      throw Error(e);
    }
  };

  return (
    <div
      style={{
        fontSize: "20px",
        padding: "2px",
        margin: "2px",
        borderColor: "lightgray",
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: "2px",
        // backgroundColor: "rebeccaPurple",
      }}
    >
      {record.name}
    </div>
  );
};
