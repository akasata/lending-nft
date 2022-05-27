export const Settings = {
  name: process.env.NFT_NAME,
  symbol: process.env.NFT_SYMBOL,
  baseTokenUri: process.env.NFT_BASE_TOKEN_URI,
  contractUri: process.env.NFT_CONTRACT_URI,
  mintNumber: parseInt(process.env.NFT_INIT_MINT_NUMBER || "0"),
};
