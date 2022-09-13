import { useEffect, useState } from "react";
import { useAccount, useContractRead } from "wagmi";
import { contract_address } from "../utils/consts";

import FLOO_NFT_CONTRACT from "../../contracts/out/Contract.sol/AuroraFloo.json"
import ClaimButton from "./claimbutton";
import FinishButton from "./finishbutton";
import { useAppContext } from "../context/appContext";
import { formatEther } from "ethers/lib/utils";
import { log } from "console";

export const zeroAddress = "0x0000000000000000000000000000000000000000";

export type Job = {
  tokenID: string;
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

  const fetchMeta = async () => {
    try {
        
      setLoading(true);
      console.log("TokenURI -> " + job?.tokenURI);
      let res = await fetch(String(job?.tokenURI));
      let json = await res.json();

      setMetadata(json);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (job.tokenURI) {
      fetchMeta();
    }
  }, [job.tokenURI]);

  useEffect(() => {
    if (jobStatusData && jobData) {  
        let newJob: Job = {
            ...job,
            creator: jobData[0],
            recipient: jobData[1],
            executorFee: formatEther(jobData[2]),
            creatorFee: formatEther(jobData[3]),
            recruiterFee: formatEther(jobData[4]),
            deadline: jobData[5].toNumber(),
            tokenURI: jobData[6],
            creatorConfirmsCompletion: jobData[7],
            recipientConfirmsCompletion: jobData[8],
          };
        
      setJob({
        ...newJob,
        claimer: jobStatusData[0],
        canceller: jobStatusData[1],
        recruiter: jobStatusData[2],
        executer: jobStatusData[3],
      });
      if (jobStatusData[1] !== zeroAddress) {
        //job has been cancelled by nonzeroaddress
        setCancelled(true);
      }
      if (jobStatusData[3] !== zeroAddress) {
        setFinished(true);
      }
    }
  }, [jobData, jobStatusData]);

  return (
    <li
      className={`${cancelled ? "border-8 border-orange-400" : ""} ${
        finished ? "border-8 border-green-400" : ""
      } card col-span-1 flex flex-col rounded-lg shadow-xl bg-base-200 `}
    >
      {metadata && job ? (
        <>
          <figure>
            <img src={metadata.image} alt="Work" />
          </figure>
          <div className="card-body">
            {cancelled ? (
              <div className="badge bg-orange-400 text-white font-bold">
                Cancelled
              </div>
            ) : null}
            {address === job.recipient ? (
              <div className="badge badge-secondary">Ours</div>
            ) : null}
            {job.executer !== zeroAddress ? (
              <div className="badge bg-green-400 text-white font-bold">
                Finished
              </div>
            ) : null}
            <h2 className="card-title">{metadata?.description}</h2>
            <div className="card-actions">
              <div>
                <div>Pays</div>

                <div className="badge badge-outline">
                  {job.executorFee}
                  ETH
                </div>
              </div>
              <div>
                <div> Creator App Reward</div>
                <div className="badge badge-outline">{job.creatorFee}</div>
              </div>
              <div>
                <div>Recruiter App Reward</div>
                <div className="badge badge-outline">{job.recruiterFee}</div>
              </div>
              <div className="flex gap-2 mt-2">
                <ClaimButton job={job} />
              </div>
              <div>
                <FinishButton job={job} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>{JSON.stringify(job)}</div>
      )}
    </li>
  );
};

export default JobCard;