import { ethers } from "hardhat";
import { BWSettings } from "./settings";

async function main() {
  console.log(BWSettings);
  if (!BWSettings.nftAddress || !BWSettings.lendingPeriodMin) {
    throw new Error(`wrong settings! Update .env file.`);
  }

  const BWrapper = await ethers.getContractFactory("BorrowableWrapper");
  const bWrapper = await BWrapper.deploy(
    BWSettings.nftAddress,
    BWSettings.lendingPeriodMin
  );
  await bWrapper.deployed();
  console.log("deployed to(Wrapper):", bWrapper.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
