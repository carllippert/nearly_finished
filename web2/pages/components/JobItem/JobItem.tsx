import React, { FC } from "react";

export type JobProps = {
  name: string;
  creator: string;
  recipient: string;
  status: string;
  amount: number;
};

const JobItem: FC<JobProps> = ({
  name,
  creator,
  recipient,
  status,
  amount,
}) => {
  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-lg border border-gray-200 shadow-md dark:border-gray-700">
      <a href="#">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 light:text-white">
          {name}
        </h5>
      </a>
      <div className="flex-row">
        <p className="mb-3 font-normal text-gray-900 dark:text-gray-400">
          {creator}
        </p>
        <div className="flex-row space-between">
          <p className="mb-3 font-normal text-gray-900 dark:text-gray-400">
            {recipient}
          </p>
          <p className="mb-3 font-normal text-gray-900 dark:text-gray-400">
            <span className="text-base">Amount:</span>&nbsp;
            <strong>{amount}&nbsp;NEAR</strong>
          </p>
        </div>
        <p className="mb-3 font-semibold text-sky-500 bg-sky-100 w-1/4 mx-auto rounded-md">
          {status}
        </p>
      </div>
      <a
        href="#"
        className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
      >
        Claim Job
        <svg
          aria-hidden="true"
          className="ml-2 -mr-1 w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      </a>
    </div>
  );
};

export default JobItem;
