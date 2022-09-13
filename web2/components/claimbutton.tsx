import { useEffect, useState } from "react";
import { useSigner, useAccount, useContractWrite, useDeprecatedContractWrite } from "wagmi";
import MLS_NFT_CONTRACT from "../../contracts/out/Contract.sol/NFT.json"
import { contract_address } from "../utils/consts";
import { Job } from "./jobCard";
let zeroAddress = "0x0000000000000000000000000000000000000000";

const ClaimButton = ({
  job
}: {
  job: Job
}) => {
  const [claimed, setClaimed] = useState(false);
  const [weClaimed, setWeClaimed] = useState(false);
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const { write: claimToken } = useDeprecatedContractWrite(
    {
      addressOrName: contract_address,
      contractInterface: MLS_NFT_CONTRACT.abi,
      signerOrProvider: signer,
      functionName: 'claimJob',
      onSettled: (data, error) => {
        console.log("Settled", data, error);
      }
    }
  );

  const { write: unClaimToken } = useDeprecatedContractWrite(
    {
      addressOrName: contract_address,
      contractInterface: MLS_NFT_CONTRACT.abi,
      signerOrProvider: signer,
      functionName: 'unClaimJob',
      onSettled: (data, error) => {
        console.log("Settled", data, error);
      },
    }
  );

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
    if (job.claimer !== zeroAddress) {
      setClaimed(true);
      if (job.claimer === address) {
        setWeClaimed(true);
      }
    }
  }, []);

  return (
    <>
      {claimed ? (
        <>
          {weClaimed ? (
            <button onClick={unClaim} className="btn btn-accent">
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
        <button onClick={claim} className="btn btn-primary">
          Claim Job
        </button>
      )}
    </>
  );
};

export default ClaimButton;
