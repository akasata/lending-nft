import { ethers } from "hardhat";

const Settings = {
  name: process.env.NFT_NAME,
  symbol: process.env.NFT_SYMBOL,
  baseTokenUri: process.env.NFT_BASE_TOKEN_URI,
  contractUri: process.env.NFT_CONTRACT_URI,
  mintNumber: parseInt(process.env.NFT_INIT_MINT_NUMBER || "0"),
};

async function main() {
  console.log(Settings);
  if (
    !Settings.name ||
    !Settings.symbol ||
    !Settings.baseTokenUri ||
    !Settings.contractUri
  ) {
    throw new Error(`wrong settings! Update .env file.`);
  }

  const LendingNFT = await ethers.getContractFactory("LendingNFT");
  const lendingNFT = await LendingNFT.deploy(
    Settings.name,
    Settings.symbol,
    Settings.baseTokenUri,
    Settings.contractUri
  );
  await lendingNFT.deployed();
  console.log("deployed to:", lendingNFT.address);

  for (let i = 0; i < Settings.mintNumber; i++) {
    await mint(lendingNFT);
  }
}

async function mint(lendingNFT: any) {
  const mintTx = await lendingNFT.mint(
    "0x74c90619c73c253606Bf8Ef02b46ffc76d64304B"
  );
  await mintTx.wait();
  console.log(`mintTx hash: ${mintTx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
