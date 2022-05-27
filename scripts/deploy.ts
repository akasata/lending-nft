import { ethers } from "hardhat";
import { Settings } from "./settings";

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

  const BorrowableNFT = await ethers.getContractFactory("BorrowableNFT");
  const borrowableNFT = await BorrowableNFT.deploy(
    Settings.name,
    Settings.symbol,
    Settings.baseTokenUri,
    Settings.contractUri
  );
  await borrowableNFT.deployed();
  console.log("deployed to:", borrowableNFT.address);

  for (let i = 0; i < Settings.mintNumber; i++) {
    await mint(borrowableNFT);
  }
}

async function mint(borrowableNFT: any) {
  const mintTx = await borrowableNFT.mint(
    "0x74c90619c73c253606Bf8Ef02b46ffc76d64304B"
  );
  await mintTx.wait();
  console.log(`mintTx hash: ${mintTx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
