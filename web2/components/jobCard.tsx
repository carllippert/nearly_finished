import { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { contract_address } from "../utils/consts";

import FLOO_NFT_CONTRACT from "../../contracts/out/Contract.sol/AuroraFloo.json";
import ClaimButton from "./claimbutton";
import FinishButton from "./finishbutton";
import { useAppContext } from "../context/appContext";
import { formatEther } from "ethers/lib/utils";
import { BigNumber, ethers } from "ethers";

export const zeroAddress = "0x0000000000000000000000000000000000000000";

export type Job = {
  tokenID: string;
  name: string;
  recordId: string;
  hasAllowlist: boolean;
  creator: string;
  recipient: string;
  executorFee: number;
  creatorFee: string;
  recruiterFee: number;
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
  let [confirmed, setConfirmed] = useState(false);
  let [finished, setFinished] = useState(false);

  const { address } = useAccount();

  let [job, setJob] = useState<Job>({
    tokenID,
    creator: "",
    name: "",
    recordId: "",
    hasAllowlist: false,
    recipient: "",
    executorFee: 0,
    creatorFee: "",
    recruiterFee: 0,
    deadline: 0,
    tokenURI: "",
    creatorConfirmsCompletion: false,
    recipientConfirmsCompletion: false,
    claimer: "",
    recruiter: "",
    canceller: "",
    executer: "",
  });

  const { data: jobData } = useContractRead({
    addressOrName: contract_address,
    contractInterface: FLOO_NFT_CONTRACT.abi,
    functionName: "getJob",
    args: tokenID,
  });

  const { data: jobStatusData } = useContractRead({
    addressOrName: contract_address,
    contractInterface: FLOO_NFT_CONTRACT.abi,
    functionName: "getJobStatus",
    args: tokenID,
  });

  useEffect(() => {
    if (jobStatusData && jobData) {
      console.log("JobStatusData => " + JSON.stringify(jobStatusData));

      setJob({
        ...job,
        claimer: jobStatusData[0],
        canceller: jobStatusData[1],
        recruiter: jobStatusData[2],
        executer: jobStatusData[3],
        name: jobData[0],
        recordId: jobData[1],
        hasAllowlist: jobData[2],
        executorFee: parseInt(BigNumber.from(jobData[3])._hex),
        creatorConfirmsCompletion: jobData[4],
        recipientConfirmsCompletion: jobData[5],
      });

      if (jobStatusData[1] !== zeroAddress) {
        //job has been cancelled by nonzeroaddress
        setCancelled(true);
      }
      if (jobStatusData[3] !== zeroAddress) {
        setFinished(true);
      }
      if (jobData[4] && jobData[5]) {
        setConfirmed(true);
      }
    }
  }, [jobStatusData, jobData]);

  return (
    <li
      className={`md:flex md:items-center md:justify-between py-8 px-8 my-2 rounded-lg border-2 ${
        finished ? "border-4 border-green-400" : ""
      }`}
    >
      <div className="min-w-0 flex-1">
        <div className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          {job.name}
        </div>
        <div>
          <div>token_id: {tokenID}</div>
          <div>
            {job.hasAllowlist ? "claim restricted" : "openly claimable"}
          </div>
          <div className="flex">
            <div className="bg-green-500 text-white p-1 rounded-lg">
              Pays: ${job.executorFee * 0.00000000005}
            </div>
            <div className="flex-1" />
          </div>
        </div>
      </div>
      <div className="mt-4 flex md:mt-0 md:ml-4">
        {finished ? null : (
          <>
            <ClaimButton job={job} />
            <FinishButton job={job} />{" "}
          </>
        )}
        <div style={{ fontSize: "70px" }}>{confirmed ? "💰" : null}</div>
      </div>
    </li>
  );
};

export default JobCard;
