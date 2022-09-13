import { useEffect } from "react";

const FetchingJob = ({ tokenId }: { tokenId: string }) => {
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
