import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, ContractFactory } from "ethers";

describe("BorrowableWrapper", function () {
  let contractOwner: SignerWithAddress;
  let borrower00: SignerWithAddress;
  let tokenHolder00: SignerWithAddress;
  let tokenHolder01: SignerWithAddress;
  let BaseNFT: ContractFactory;
  let baseNFT: Contract;
  let BWrapper: ContractFactory;
  let bWrapper: Contract;

  describe("URI", function () {
    before(async () => {
      [contractOwner, borrower00, tokenHolder00, tokenHolder01] =
        await ethers.getSigners();

      BaseNFT = await ethers.getContractFactory("BaseNFT");
      baseNFT = await BaseNFT.deploy(
        "BaseNFT",
        "BRRW",
        "https://example.com/nfts/"
      );
      await baseNFT.deployed();

      BWrapper = await ethers.getContractFactory("BorrowableWrapper");
      bWrapper = await BWrapper.deploy(baseNFT.address, 1440);
      await bWrapper.deployed();
    });

    it("mint and get TokenURI", async function () {
      // mint
      await (
        await baseNFT.connect(contractOwner).mint(contractOwner.address, 119)
      ).wait();
      expect(await baseNFT.totalSupply()).to.equal(119);
      expect(await baseNFT.tokenURI(1)).to.equal("https://example.com/nfts/1");
      expect(await baseNFT.tokenURI(119)).to.equal(
        "https://example.com/nfts/119"
      );
      expect(await baseNFT.balanceOf(contractOwner.address)).to.equal(119);
      expect(await bWrapper.balanceOf(contractOwner.address)).to.equal(119);
    });
  });

  describe("Borrow NFT", function () {
    before(async () => {
      BaseNFT = await ethers.getContractFactory("BaseNFT");
      baseNFT = await BaseNFT.deploy(
        "BaseNFT",
        "BRRW",
        "https://example.com/nfts/"
      );
      await baseNFT.deployed();

      BWrapper = await ethers.getContractFactory("BorrowableWrapper");
      bWrapper = await BWrapper.deploy(baseNFT.address, 1440);
      await bWrapper.deployed();

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

    it("borrow, transfer", async function () {
      expect(await bWrapper.lendingCount(1)).to.equal(0);

      const borrow1Tx = await bWrapper.connect(borrower00).borrow(1);
      await borrow1Tx.wait();

      expect(await baseNFT.ownerOf(1)).to.equal(tokenHolder00.address);
      expect(await baseNFT.balanceOf(borrower00.address)).to.equal(0);
      expect(await baseNFT.balanceOf(tokenHolder00.address)).to.equal(1);

      expect(await bWrapper.ownerOf(1)).to.equal(tokenHolder00.address);
      expect(await bWrapper.balanceOf(borrower00.address)).to.equal(1);
      expect(await bWrapper.balanceOf(tokenHolder00.address)).to.equal(0);
      expect(await bWrapper.lendingCount(1)).to.equal(1);

      // transfer
      const transfer1Tx = await baseNFT
        .connect(tokenHolder00)
        .transferFrom(tokenHolder00.address, tokenHolder01.address, 1);
      await transfer1Tx.wait();

      expect(await baseNFT.ownerOf(1)).to.equal(tokenHolder01.address);
      expect(await baseNFT.balanceOf(borrower00.address)).to.equal(0);
      expect(await baseNFT.balanceOf(tokenHolder00.address)).to.equal(0);
      expect(await baseNFT.balanceOf(tokenHolder01.address)).to.equal(1);

      expect(await bWrapper.ownerOf(1)).to.equal(tokenHolder01.address);
      expect(await bWrapper.balanceOf(borrower00.address)).to.equal(1);
      expect(await bWrapper.balanceOf(tokenHolder00.address)).to.equal(0);
      expect(await bWrapper.balanceOf(tokenHolder01.address)).to.equal(0);
      expect(await bWrapper.lendingCount(1)).to.equal(1);
    });
  });
});
