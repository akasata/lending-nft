import { ethers } from "hardhat";
import { NFTSettings } from "./settings";

async function main() {
  console.log(NFTSettings);
  if (
    !NFTSettings.name ||
    !NFTSettings.symbol ||
    !NFTSettings.baseTokenUri ||
    !NFTSettings.contractUri
  ) {
    throw new Error(`wrong settings! Update .env file.`);
  }

  const BaseNFT = await ethers.getContractFactory("BaseNFT");
  const baseNFT = await BaseNFT.deploy(
    NFTSettings.name,
    NFTSettings.symbol,
    NFTSettings.baseTokenUri,
    NFTSettings.contractUri
  );
  await baseNFT.deployed();
  console.log("deployed to(NFTAddress):", baseNFT.address);

  const mintTx = await baseNFT.mint(
    NFTSettings.mintAddress,
    NFTSettings.mintNumber
  );
  await mintTx.wait();
  console.log(`mintTx hash: ${mintTx.hash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
