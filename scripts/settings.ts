export const NFTSettings = {
  name: process.env.NFT_NAME,
  symbol: process.env.NFT_SYMBOL,
  baseTokenUri: process.env.NFT_BASE_TOKEN_URI,
  contractUri: process.env.NFT_CONTRACT_URI,
  mintNumber: parseInt(process.env.NFT_INIT_MINT_NUMBER || "0"),
  mintAddress: process.env.NFT_INIT_MINT_ADDRESS,
};

export const BWSettings = {
  nftAddress: process.env.BW_NFT_ADDRESS,
  lendingPeriodMin: parseInt(process.env.BW_LENDING_PERIOD_MIN || "1440"),
};
