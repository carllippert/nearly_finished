import React, { useEffect, useState } from "react";
import {
  useContractWrite,
  useAccount,
  useBlockNumber,
  useContractRead,
} from "wagmi";
import { AURORA_FLOO_ABI } from "./AuroraFlooAbi";
import { parseUnits, parseEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";
import { useBase } from "@airtable/blocks/ui";

const contract_address = "0xC681CE1a7780098A80Ec0609E5Ef32b6479f9a92";

export const JobItem = ({ record }) => {
//TODO: fetch airtable data, 
  //TODO: update the record with tokenId if we don't have it yet. 
  
  let [jobsCount, setJobsCount] = useState(0);

  const base = useBase();
  const table = base.getTableByName("Jobs");
  // const records = useRecords(table);

  const [hydrated, setHydrated] = useState(false);
  const { address, isConnecting, isDisconnected } = useAccount();

  //on first hit
  useEffect(() => {
    console.log("hydated");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      let pleaseMint = record.getCellValue("please_mint");
      console.log("PleaseMint ?=> " + pleaseMint);
      let minted = record.getCellValue("minted");
      console.log("Minted ?=> " + minted);

      let confirm = record.getCellValue("confirmed");

      if (pleaseMint && !minted && !confirm) {
        mint();
      }

      if (confirm) {
        confirmTxn();
      }
    }
  }, [record.getCellValue("stateString")]);

  const { writeAsync } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: contract_address,
    contractInterface: AURORA_FLOO_ABI.abi,
    functionName: "mintTo",
  });


  const mint = async () => {
    try {

      const ethExecFee = parseUnits(
        String(record.getCellValue("exec_fee_eth"))
      );
      console.log("ethExecFee " + ethExecFee);
      const ethRecruiterFee = parseUnits(
        String(record.getCellValue("rec_fee_eth"))
      );
      console.log("ethRecruiterFee " + ethRecruiterFee);
      const ethCreatorFee = parseUnits(
        String(record.getCellValue("creator_fee_eth"))
      );
      console.log("ethCreatorFee " + ethCreatorFee);
      const deadline = Date.now() + 1000;

      console.log("deadline =>" + deadline);

      let payment = BigNumber.from(ethExecFee)
        .add(BigNumber.from(ethCreatorFee))
        .add(BigNumber.from(ethRecruiterFee));

      console.log("Payment" + JSON.stringify(payment));

      let allowListBlob = record.getCellValue("wallet_address");
      console.log("allowList ?=> " + JSON.stringify(allowListBlob));

      let allowlist = [];

      if(allowListBlob){
        allowListBlob.forEach((item) => {
          allowlist.push(item.value);
        });
      }

      let name = record.name;

      const blob = {
        args: [
          name,
          record.id, //airtable id
          address, //creator
          address, //receiver
          "https://ctinsvafusekcbpznpfr.supabase.co/storage/v1/object/public/nft-metadata/metadata.json", //tokenuri
          ethExecFee,
          ethRecruiterFee,
          ethCreatorFee,
          deadline,
          allowlist, //add user addresses
        ],
        overrides: { value: payment },
      };

      console.log("Blob => " + JSON.stringify(blob));

      await writeAsync(blob);

    } catch (e) {
      console.log("Error" + JSON.stringify(e));
      throw Error(e);
    }
  };

  const { writeAsync: writeConfirm } = useContractWrite({
    mode: "recklesslyUnprepared",
    addressOrName: contract_address,
    contractInterface: AURORA_FLOO_ABI.abi,
    functionName: "creatorConfirmJobCompletion",
  });

  const confirmTxn = async () => {
    try {
      let tokenId = record.getCellValue("tokenId");
      console.log("tokenId ?=> " + tokenId);

      await writeConfirm({
        args: [tokenId],
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      style={{
        fontSize: "14px",
        padding: "2px",
        margin: "2px",
        borderColor: "lightgray",
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "2px",
      }}
    >
      {record.name}
    </div>
  );
};
