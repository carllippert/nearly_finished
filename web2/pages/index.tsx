import type { NextPage } from "next";
import type { FC } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import JobItem, { JobProps } from "./components/JobItem/JobItem";

// TODO: kill this
const MOCK_JOBS = [
  {
    name: "This is a Job Name",
    creator: "Creator Name",
    recipient: "Recipient Name",
    status: "Completed",
    amount: 30,
  },
  {
    name: "This is a Job Name",
    creator: "Creator Name",
    recipient: "Recipient Name",
    status: "Completed",
    amount: 30,
  },
  {
    name: "This is a Job Name",
    creator: "Creator Name",
    recipient: "Recipient Name",
    status: "Completed",
    amount: 30,
  },
];

const Home: NextPage = () => {
  return (
    <div className="py-6 justify-center text-center">
      <div className="flex justify-center">
        <ConnectButton />
      </div>

      <h1 className="text-4xl font-bold mt-6 mb-6">🚀 The Floo Network</h1>
      <div className="flex-col space-y-3">
        {MOCK_JOBS.map((job: JobProps, idx) => (
          <JobItem {...job} key={idx} />
        ))}
      </div>
    </div>
  );
};

export default Home;
