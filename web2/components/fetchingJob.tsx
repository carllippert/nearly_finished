import { useEffect } from "react";

export type Job = {
  tokenID: string;
  recordId: string; 
  recipient: string;
  executorFee: string;
  creatorFee: string;
  recruiterFee: string;
  deadline: number;
  tokenURI: string;
  claimer: string;
  recruiter: string;
  canceller: string;
  executer: string;
};

const FetchingJob = ({ tokenId }: { tokenId: string }) => {

  let [job, setJob] = useState<Job>({
    tokenID,
    recipient: "",
    executorFee: "",
    creatorFee: "",
    recruiterFee: "",
    deadline: 0,
    tokenURI: "",
    claimer: "",
    recruiter: "",
    canceller: "",
    executer: "",
  });

  useEffect(() => {
    console.log("In fetch job");
  }, []);

  return (
    <div style={{ height: "50px" }} className="bg-pink-100">
      {tokenId}
    </div>
  );
};

export default FetchingJob;
