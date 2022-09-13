import type { NextPage } from "next";
import { FC, useState, useEffect } from "react";
import StackedLayout from "../components/stackedLayout";
import JobCard from "../components/jobCard";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import { useContractRead } from "wagmi";
import { contract_address } from "../utils/consts";
import FLOO_NFT_CONTRACT from "../../contracts/out/Contract.sol/AuroraFloo.json";
import { BigNumber, ethers } from "ethers";
import FetchingJob from "../components/fetchingJob";

type FakeJob = {
  tokenID: string;
};

const Home: NextPage = () => {
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
    <StackedLayout>
      {jobsCount > 0 ? (
        <>
          {fakeJobs.map((job) => {
            return <JobCard key={job.tokenID} tokenID={job.tokenID} />;
          })}
        </>
      ) : (
        "No Jobs"
      )}
      {/* <JobCard tokenID="1"/>
      <JobCard tokenID="2"/>
      <JobCard tokenID="3"/> */}
    </StackedLayout>
  );
};

const Wrapper: FC = () => {
  return (
    <div className="py-6 justify-center text-center">
      <div className="flex justify-center">
        <ConnectButton />
      </div>

      <h1 className="text-4xl font-bold mt-6">🚀 create-web3-frontend</h1>
      <InfoSection />
    </div>
  );
};
const InfoSection: FC = () => {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-bold">If you need help</h2>
      <div className="flex flex-col gap-2 mt-2">
        <a
          href="https://wagmi.sh"
          target="_blank"
          className="underline text-gray-600"
        >
          Link to wagmi docs
        </a>
        <a
          href="https://github.com/dhaiwat10/create-web3-frontend"
          target="_blank"
          className="underline text-gray-600"
        >
          Open an issue on Github
        </a>
        <a
          href="https://twitter.com/dhaiwat10"
          target="_blank"
          className="underline text-gray-600"
        >
          DM me on Twitter
        </a>
      </div>
    </div>
  );
};

export default Home;
