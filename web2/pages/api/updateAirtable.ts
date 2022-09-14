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

const CHAIN_ID = 1313161555; // aurora testnet

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

const NFTS_AMOUNT = 4;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function range(start: number, end: number) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

// called by cron (github actions is fine for now every 5 minutes)
export default async function updateAirtable(
  req: NextApiRequest,
  res: NextApiResponse<NftList>
) {
  // https://api.covalenthq.com/v1/1313161555/events/address/0x1192397155104C9F3e0cb8112f3eF0625905873E/?starting-block=100100000&ending-block=100600000
  // const response = await axios.get(`https://api.covalenthq.com/v1/${CHAIN_ID}/events/address/${SMART_CONTRACT_ID}/?starting-block=100100000&ending-block=100600000&key=${COVALENT_API_KEY}`)
  // const claimEvents = response.data.data.items.filter(item => item.decoded && item.decoded.name == 'OwnershipTransferred');
  // // Do not claim if already claimed, or finished
  // await Promise.all(claimEvents.map(async e => {
  //   console.log(e.) // TODO: create proper events to be able filter
  // }))


  // Getting NFT metadata from covalent 
  // https://api.covalenthq.com/v1/1313161555/tokens/0xC025Ac15557a11cc614d1Cf725dB18aeDdf1cFC5/nft_metadata/4/
  // for (let i = 0; i < NFTS_AMOUNT; i += 5) {
  //   const tokenIds = range(i * 5 + 1, Math.min((i + 1) * 5 + 1, NFTS_AMOUNT));
  //   console.log('tokenIds', tokenIds)
  //   await Promise.all(tokenIds.map(async (tokenId) => { 
  //     console.log('Requesting token metadata', tokenId)
  //     const response = await axios.get(`https://api.covalenthq.com/v1/${CHAIN_ID}/tokens/${SMART_CONTRACT_ID}/nft_metadata/${tokenId}/?key=${COVALENT_API_KEY}`)
  //     if (response.data.data.items[0].nft_data) {
  //       console.log('Token metadata', tokenId, response.data.data.items[0].nft_data[0])
  //     } else {
  //       console.log('Token metadata is empty', tokenId)
  //     }
  //   }));
  //   await sleep(1000);
  // }
  
  res.status(200)
}
