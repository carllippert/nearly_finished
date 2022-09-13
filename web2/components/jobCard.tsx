import { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { contract_address } from "../utils/consts";

import FLOO_NFT_CONTRACT from "../../contracts/out/Contract.sol/AuroraFloo.json"
import ClaimButton from "./claimbutton";
import FinishButton from "./finishbutton";
import { useAppContext } from "../context/appContext";
import { formatEther } from "ethers/lib/utils";

export const zeroAddress = "0x0000000000000000000000000000000000000000";

export type Job = {
  tokenID: string;
  name: string; 
  recrodId: string; 
  hasAllowlist: boolean; 
  creator: string;
  recipient: string;
  executorFee: string;
  creatorFee: string;
  recruiterFee: string;
  deadline: number;
  tokenURI: string;
  creatorConfirmsCompletion: boolean;
  recipientConfirmsCompletion: boolean;
  claimer: string;
  recruiter: string;
  canceller: string;
  executer: string;
};

const JobCard = ({ tokenID }: { tokenID: string }) => {

  let [metadata, setMetadata] = useState<any>(null);
  let [loading, setLoading] = useState(false);
  let [cancelled, setCancelled] = useState(false);
  let [finished, setFinished] = useState(false);

  const { address } = useAccount();

  let [job, setJob] = useState<Job>({
    tokenID,
    creator: "",
    name: "", 
    recordId: "", 
    hasAllowList: "", 
    recipient: "",
    executorFee: "",
    creatorFee: "",
    recruiterFee: "",
    deadline: 0,
    tokenURI: "",
    creatorConfirmsCompletion: false,
    recipientConfirmsCompletion: false,
    claimer: "",
    recruiter: "",
    canceller: "",
    executer: "",
  });

  const { data: jobData } = useContractRead(
    {
      addressOrName: contract_address,
      contractInterface: FLOO_NFT_CONTRACT.abi,
      functionName: 'getJob',
      args: tokenID,
    },
  );

  const { data: jobStatusData } = useContractRead(
    {
      addressOrName: contract_address,
      contractInterface: FLOO_NFT_CONTRACT.abi,
      functionName: 'getJobStatus',
      args: tokenID,
    }
  );

  // const fetchMeta = async () => {
  //   try {
        
  //     setLoading(true);
  //     console.log("TokenURI -> " + job?.tokenURI);
  //     let res = await fetch(String(job?.tokenURI));
  //     let json = await res.json();

  //     setMetadata(json);
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (job.tokenURI) {
  //     fetchMeta();
  //   }
  // }, [job.tokenURI]);



  useEffect(() => {
    if(jobStatusData && jobData){
    console.log("JobStatusData => " + JSON.stringify(jobStatusData)); 

    setJob({ 
      ...job, 
      claimer: jobStatusData[0], 
      canceller: jobStatusData[1],
      recruiter: jobStatusData[2],
      executer: jobStatusData[3],
      name: jobData[0], 
      recordId: jobData[1], 
      hasAllowList: jobData[2], 
    }) 
 
    if (jobStatusData[1] !== zeroAddress) {
            //job has been cancelled by nonzeroaddress
            setCancelled(true);
          } 
          if (jobStatusData[3] !== zeroAddress) {
            setFinished(true);
          }
  } 
  }, [jobStatusData, jobData]); 
 

  return (
    <li className={`md:flex md:items-center md:justify-between py-8 px-8 my-2 rounded-lg border-2 ${finished ? "border-8 border-green-400" : ""}`} >
        <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Job Number: {tokenID}
        </h2>
        {JSON.stringify(job, null, 3)}
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 bg-pink-100">
        <ClaimButton job={job} />
        <FinishButton job={job} />
        </div>
    </li>
  );
};

export default JobCard;