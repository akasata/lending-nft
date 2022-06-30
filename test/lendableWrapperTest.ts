import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, ContractFactory } from "ethers";

describe("LendableWrapper", function () {
  let contractOwner: SignerWithAddress;
  let firstSeller: SignerWithAddress;
  let borrower00: SignerWithAddress;
  let tokenHolder00: SignerWithAddress;
  let tokenHolder01: SignerWithAddress;
  let BaseNFT: ContractFactory;
  let baseNFT: Contract;
  let LWrapper: ContractFactory;
  let lWrapper: Contract;

  const expiresPeriod = 60 * 60 * 1000; // 1 hour

  before(async () => {
    [contractOwner, firstSeller, borrower00, tokenHolder00, tokenHolder01] =
      await ethers.getSigners();
  });

  describe("Lender NFT", function () {
    before(async () => {
      BaseNFT = await ethers.getContractFactory("BaseNFT");
      baseNFT = await BaseNFT.deploy(
        "BaseNFT",
        "BRRW",
        "https://example.com/nfts/"
      );
      await baseNFT.deployed();

      LWrapper = await ethers.getContractFactory("LendableWrapper");
      lWrapper = await LWrapper.deploy(baseNFT.address, firstSeller.address);
      await lWrapper.deployed();

      // mint
      await (
        await baseNFT.connect(contractOwner).mint(contractOwner.address, 5)
      ).wait();

      // transfer
      const transfer1Tx = await baseNFT
        .connect(contractOwner)
        .transferFrom(contractOwner.address, tokenHolder00.address, 1);
      await transfer1Tx.wait();
    });

    it("lend, transfer", async function () {
      const expires = Date.now() + expiresPeriod;

      expect(await lWrapper.lentCount(1)).to.equal(0);

      const borrow1Tx = await lWrapper
        .connect(tokenHolder00)
        .setUser(1, borrower00.address, expires);
      await borrow1Tx.wait();

      expect(await baseNFT.ownerOf(1)).to.equal(tokenHolder00.address);
      expect(await baseNFT.balanceOf(borrower00.address)).to.equal(0);
      expect(await baseNFT.balanceOf(tokenHolder00.address)).to.equal(1);

      expect(await lWrapper.ownerOf(1)).to.equal(tokenHolder00.address);
      expect(await lWrapper.balanceOf(borrower00.address)).to.equal(0);
      expect(await lWrapper.balanceOf(tokenHolder00.address)).to.equal(1);
      expect(await lWrapper.lentCount(1)).to.equal(1);

      // IERC4907
      expect(await lWrapper.userOf(1)).to.equal(borrower00.address);
      expect(await lWrapper.userExpires(1)).to.equal(expires);

      // transfer
      const transfer1Tx = await baseNFT
        .connect(tokenHolder00)
        .transferFrom(tokenHolder00.address, tokenHolder01.address, 1);
      await transfer1Tx.wait();

      expect(await baseNFT.ownerOf(1)).to.equal(tokenHolder01.address);
      expect(await baseNFT.balanceOf(borrower00.address)).to.equal(0);
      expect(await baseNFT.balanceOf(tokenHolder00.address)).to.equal(0);
      expect(await baseNFT.balanceOf(tokenHolder01.address)).to.equal(1);

      expect(await lWrapper.ownerOf(1)).to.equal(tokenHolder01.address);
      expect(await lWrapper.balanceOf(borrower00.address)).to.equal(0);
      expect(await lWrapper.balanceOf(tokenHolder00.address)).to.equal(0);
      expect(await lWrapper.balanceOf(tokenHolder01.address)).to.equal(1);
      expect(await lWrapper.lentCount(1)).to.equal(1);
    });
  });
});
