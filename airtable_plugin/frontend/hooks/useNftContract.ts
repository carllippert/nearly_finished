import { Contract, ethers, BigNumber } from "ethers";
import { formatUnits, parseUnits, parseEther } from "ethers/lib/utils";
import { useAccount, useBlockNumber, useConnect, useDisconnect } from "wagmi";

import { AURORA_FLOO_ABI } from "../AuroraFlooAbi";
const contract_address = "0xC025Ac15557a11cc614d1Cf725dB18aeDdf1cFC5";
const ethereum = typeof window !== "undefined" && (window as any).ethereum;

const getNftContract = (): Contract => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  return new ethers.Contract(contract_address, AURORA_FLOO_ABI.abi, signer);
};

const useNftContract = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const nftContract = getNftContract();
  const { data: blockStamp } = useBlockNumber();

  const mint = async () => {
    try {
      const ethExecFee = parseEther("0.0001");
      const ethRecruiterFee = parseEther("0.0001");
      const ethCreatorFee = parseEther("0.0001");
      const deadline = blockStamp + 1000;

      let payment = BigNumber.from(ethExecFee)
        .add(BigNumber.from(ethCreatorFee))
        .add(BigNumber.from(ethRecruiterFee));

      const testTokenURI = "Test String About The NFT. In Future a URL to JSON";

      const stuff = await nftContract.mintTo(
        address,
        address,
        testTokenURI,
        ethExecFee,
        ethRecruiterFee,
        ethCreatorFee,
        deadline,
        { value: payment }
      );

      console.log("Stuff" + JSON.stringify(stuff));
    } catch (e) {
      console.log("Error" + JSON.stringify(e));
      throw Error(e);
    }
  };

  return {
    mint,
  };
};

export default useNftContract;
