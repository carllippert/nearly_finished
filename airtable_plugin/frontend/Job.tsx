import React, { useEffect, useState } from "react";
import { usePrepareContractWrite, useContractWrite } from "wagmi";

//TODO: get abi. 
const abi = ""; 
const address = ""; 

export const JobItem = ({ record }) => {
  const [hydrated, setHydrated] = useState(false);

  //on first hit
  useEffect(() => {
    console.log("hydated");
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      alert("Changed Record");
    }
  }, [record.getCellValue("stateString")]);

  const { config } = usePrepareContractWrite({
    addressOrName: address,
    contractInterface: abi, 
    functionName: 'mintTo',
  })
  const { data, isLoading, isSuccess, write } = useContractWrite(config)

  const mint = () => {
   
  }

  return <div>{record.name}</div>;
};
