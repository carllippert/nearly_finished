import { useSigner, useAccount, useContractWrite, useDeprecatedContractWrite } from "wagmi";
import MLS_NFT_CONTRACT from "../../contracts/out/Contract.sol/NFT.json";
import { contract_address } from "../utils/consts";
import { Job, zeroAddress } from "./jobCard";

const FinishButton = ({ job }: { job: Job }) => {
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const { write: finishToken } = useDeprecatedContractWrite(
    {
      addressOrName: contract_address,
      contractInterface: MLS_NFT_CONTRACT.abi,
      signerOrProvider: signer,
      functionName: 'finishJob',
      onSettled: (data, error) => {
        console.log("Settled", data, error);
      }
    }
  );

  const finish = async () => {
    await finishToken({
      args: [job.tokenID, address],
      //token, executer
    });
  };

  return (
    <div>
      {job.claimer === address || job.claimer === zeroAddress ? (
        <button onClick={finish} className="btn btn-success">
          FINISH
        </button>
      ) : null}
    </div>
  );
};

export default FinishButton;
