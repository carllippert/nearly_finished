import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'

const {
  SMART_CONTRACT_ID,
  COVALENT_API_KEY
} = process.env;

if (!SMART_CONTRACT_ID) {
  throw new Error('SMART_CONTRACT_ID is not populated')
}

if (!COVALENT_API_KEY) {
  throw new Error('COVALENT_API_KEY is not populated')
}

type NftListItem = {
  contract_decimals: number,
  contract_name: string,
  contract_ticker_symbol: string,
  contract_address: string,
  // supports_erc: null,
  logo_url: string,
  token_id: string
}

type NftList = {
  nfts: NftListItem[]
}

export default async function listNfts(
  req: NextApiRequest,
  res: NextApiResponse<NftList>
) {
  // TODO: request from Airtable instead
  const nfts = await axios.get(`https://api.covalenthq.com/v1/1/tokens/${SMART_CONTRACT_ID}/nft_token_ids/?key=${COVALENT_API_KEY}`)
  console.log(nfts.data.data.items)
  const result = { nfts: nfts.data.data.items };
  res.status(200).json(result)
}
