export const Settings = {
  name: process.env.NFT_NAME,
  symbol: process.env.NFT_SYMBOL,
  baseTokenUri: process.env.NFT_BASE_TOKEN_URI,
  contractUri: process.env.NFT_CONTRACT_URI,
  mintNumber: parseInt(process.env.NFT_INIT_MINT_NUMBER || "0"),
  lendingPeriodMin: parseInt(process.env.NFT_LENDING_PERIOD_MIN || "1440"),
};
