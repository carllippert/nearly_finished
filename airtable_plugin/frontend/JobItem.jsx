import React, { useEffect, useState } from "react";
import { useContractWrite, useAccount, useBlockNumber } from "wagmi";
import { AURORA_FLOO_ABI } from "./AuroraFlooAbi";
import { parseUnits, parseEther } from "ethers/lib/utils";
import { BigNumber } from "ethers";

const contract_address = "0xCF1Ae320Dc953EFb8B0A22866af86503bd6AD3E3";

export const JobItem = ({ record }) => {
  const [hydrated, setHydrated] = useState(false);
  const { address, isConnecting, isDisconnected } = useAccount();

  const { data: blockStamp } = useBlockNumber();
  //on first hit
  useEffect(() => {
    console.log("hydated");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      // alert("Changed Record");
     let pleaseMint =  record.getCellValue("please_mint"); 
     console.log("PleaseMint ?=> " + pleaseMint); 
     let minted = record.getCellValue("minted"); 
     console.log("Minted ?=> " + minted); 
      

     if(pleaseMint && !minted){
      mint();
     }
      
    }
  }, [record.getCellValue("stateString")]);

  const { data, isLoading, isSuccess, writeAsync, write } = useContractWrite({
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

      allowListBlob.forEach((item) => {
        allowlist.push(item.value); 
      }); 

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
