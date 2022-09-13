import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useContractRead } from "wagmi";
import { contract_address } from "../utils/consts";
import FLOO_NFT_CONTRACT from "../../contracts/out/Contract.sol/AuroraFloo.json";
import { BigNumber, ethers } from "ethers";
import FetchingJob from "../components/fetchingJob";

type FakeJob = {
  tokenID: string;
};

const FetchingData = () => {
  let [jobsCount, setJobsCount] = useState(0);
  let [fakeJobs, setFakeJobs] = useState<FakeJob[]>([]);

  const { data } = useContractRead({
    addressOrName: contract_address,
    contractInterface: FLOO_NFT_CONTRACT.abi,
    functionName: "getCurrentTokenId",
  });

  useEffect(() => {
    if (data && jobsCount === 0) {
      let number = BigNumber.from(data);

      let parsed = parseInt(number._hex);

      console.log("CurrentTokenID", parsed);

      setJobsCount(parsed);

      let _fakeJobs: FakeJob[] = [];
      for (let i = 0; i < parsed; i++) {
        console.log("Make Fake Job");
        _fakeJobs.push({ tokenID: String(i + 1) });
      }
      setFakeJobs(_fakeJobs);
    }
  }, [data]);

  return (
    <div>
      {jobsCount > 0 ? (
        <>
          {fakeJobs.map((job) => {
            return <FetchingJob key={job.tokenID} tokenId={job.tokenID} />;
          })}
        </>
      ) : (
        "No Jobs"
      )}
      {/* <div>{JSON.stringify(fakeJobs)}</div> */}
    </div>
  );
};

export default FetchingData;
