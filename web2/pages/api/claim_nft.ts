// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ethers } from "ethers";
import { parseUnits } from "ethers/lib/utils";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

var Airtable = require("airtable");

Airtable.configure({
  endpointUrl: "https://api.airtable.com",
  apiKey: process.env.AIRTABLE_API_KEY,
});

var base = Airtable.base("appOnkz0CjeAKYq89");

export default async (
  req: NextApiRequest,
  res: NextApiResponse<Data | { error: string }>
) => {
  const { tokenId, recordId } = req.query;
  console.log({ tokenId });
  console.log({ recordId });
  try {
    const updatedJobs = await base("Jobs").update(recordId, { tokenId });
    res.status(200).json(updatedJobs);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Unable to update job" });
  }
};
