import { useEffect, useState } from "react";
import {
  useSigner,
  useAccount,
  useContractWrite,
  useDeprecatedContractWrite,
} from "wagmi";
import MLS_NFT_CONTRACT from "../../contracts/out/Contract.sol/NFT.json";
import { contract_address } from "../utils/consts";
import { Job } from "./jobCard";
let zeroAddress = "0x0000000000000000000000000000000000000000";

const ClaimButton = ({ job }: { job: Job }) => {
  const [claimed, setClaimed] = useState(false);
  const [weClaimed, setWeClaimed] = useState(false);
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const { write: claimToken } = useDeprecatedContractWrite({
    addressOrName: contract_address,
    contractInterface: MLS_NFT_CONTRACT.abi,
    signerOrProvider: signer,
    functionName: "claimJob",
    onSettled: (data, error) => {
      console.log("Settled", data, error);
    },
  });

  const { write: unClaimToken } = useDeprecatedContractWrite({
    addressOrName: contract_address,
    contractInterface: MLS_NFT_CONTRACT.abi,
    signerOrProvider: signer,
    functionName: "unClaimJob",
    onSettled: (data, error) => {
      console.log("Settled", data, error);
    },
  });

  const claim = async () => {
    if (address) {
      await claimToken({
        args: [
          job.tokenID,
          address, //recruiter
          address, //executer
        ],
      });
    } else {
      console.log("No account for claim");
    }
  };

  const unClaim = async () => {
    await unClaimToken({
      args: [job.tokenID],
    });
  };

  useEffect(() => {
    if (job.claimer === zeroAddress) {
      setClaimed(false);
    } else {
      setClaimed(true);
      if (job.claimer === address) {
        setWeClaimed(true);
      }
    }
  }, [address, job, job.claimer]);

  return (
    <>
      {claimed ? (
        <>
          {weClaimed ? (
            <button
              type="button"
              onClick={unClaim}
              className="inline-flex items-center rounded-md border border-gray-300 bg-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Unclaim
            </button>
          ) : (
            <div className="bg-base-200 text-base rounded-md shadow-xl px-4">
              <div> Claimed By:</div>
              {job.claimer.substring(0, 7)}...
            </div>
          )}
        </>
      ) : (
        <button
          type="button"
          onClick={claim}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Claim Job
        </button>
      )}
    </>
  );
};

export default ClaimButton;
