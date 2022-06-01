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

  const BaseNFT = await ethers.getContractFactory("BaseNFTA");
  const baseNFT = await BaseNFT.deploy(
    Settings.name,
    Settings.symbol,
    Settings.baseTokenUri,
    Settings.contractUri
  );
  await baseNFT.deployed();
  console.log("deployed to(NFT):", baseNFT.address);

  const BWrapper = await ethers.getContractFactory("BorrowableWrapperA");
  const bWrapper = await BWrapper.deploy(baseNFT.address);
  await bWrapper.deployed();
  console.log("deployed to(Wrapper):", bWrapper.address);

  const mintTx = await baseNFT.mint(
    "0x74c90619c73c253606Bf8Ef02b46ffc76d64304B",
    Settings.mintNumber
  );
  await mintTx.wait();
  console.log(`mintTx hash: ${mintTx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
