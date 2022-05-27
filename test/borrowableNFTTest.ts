import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, ContractFactory } from "ethers";

describe("BorrowableNFT", function () {
  let contractOwner: SignerWithAddress;
  let borrower00: SignerWithAddress;
  let tokenHolder00: SignerWithAddress;
  let tokenHolder01: SignerWithAddress;
  let BorrowableNFT: ContractFactory;
  let borrowableNFT: Contract;

  describe("URI", function () {
    before(async () => {
      [contractOwner, borrower00, tokenHolder00, tokenHolder01] =
        await ethers.getSigners();

      BorrowableNFT = await ethers.getContractFactory("BorrowableNFT");
      borrowableNFT = await BorrowableNFT.deploy(
        "BorrowableNFT",
        "BRRWNFT",
        "https://example.com/nfts/",
        "https://example.com/contracts/1"
      );
      await borrowableNFT.deployed();
    });

    it("mint and get TokenURI", async function () {
      // mint
      await (
        await borrowableNFT.connect(contractOwner).mint(contractOwner.address)
      ).wait();
      expect(await borrowableNFT.totalSupply()).to.equal(1);
      expect(await borrowableNFT.tokenURI(0)).to.equal(
        "https://example.com/nfts/0"
      );
      expect(await borrowableNFT.balanceOf(contractOwner.address)).to.equal(1);

      // mint
      await (
        await borrowableNFT.connect(contractOwner).mint(contractOwner.address)
      ).wait();
      expect(await borrowableNFT.totalSupply()).to.equal(2);
      expect(await borrowableNFT.tokenURI(1)).to.equal(
        "https://example.com/nfts/1"
      );
      expect(await borrowableNFT.balanceOf(contractOwner.address)).to.equal(2);
    });

    it("Contract URI", async function () {
      expect(await borrowableNFT.contractURI()).to.equal(
        "https://example.com/contracts/1"
      );
    });
  });

  describe("Borrow NFT", function () {
    before(async () => {
      //      [contractOwner, signer01, tokenHolder01] = await ethers.getSigners();

      BorrowableNFT = await ethers.getContractFactory("BorrowableNFT");
      borrowableNFT = await BorrowableNFT.deploy(
        "BorrowableNFT",
        "BRRWNFT",
        "https://example.com/nfts/",
        "https://example.com/contracts/1"
      );
      await borrowableNFT.deployed();

      // mint
      await (
        await borrowableNFT.connect(contractOwner).mint(contractOwner.address)
      ).wait();
      await (
        await borrowableNFT.connect(contractOwner).mint(contractOwner.address)
      ).wait();

      // transfer
      const transfer1Tx = await borrowableNFT
        .connect(contractOwner)
        .transferFrom(contractOwner.address, tokenHolder00.address, 1);
      await transfer1Tx.wait();
    });

    it("Borrow NFT", async function () {
      expect(await borrowableNFT.lendingCount(1)).to.equal(0);

      const borrow1Tx = await borrowableNFT.connect(borrower00).borrow(1);
      await borrow1Tx.wait();

      expect(await borrowableNFT.ownerOf(1)).to.equal(tokenHolder00.address);
      expect(await borrowableNFT.balanceOf(contractOwner.address)).to.equal(1);
      expect(await borrowableNFT.balanceOf(borrower00.address)).to.equal(1);
      expect(await borrowableNFT.balanceOf(tokenHolder00.address)).to.equal(0);
      expect(await borrowableNFT.lendingCount(1)).to.equal(1);

      // transfer
      const transfer1Tx = await borrowableNFT
        .connect(tokenHolder00)
        .transferFrom(tokenHolder00.address, tokenHolder01.address, 1);
      await transfer1Tx.wait();

      expect(await borrowableNFT.ownerOf(1)).to.equal(tokenHolder01.address);
      expect(await borrowableNFT.balanceOf(contractOwner.address)).to.equal(1);
      expect(await borrowableNFT.balanceOf(borrower00.address)).to.equal(1);
      expect(await borrowableNFT.balanceOf(tokenHolder00.address)).to.equal(0);
      expect(await borrowableNFT.balanceOf(tokenHolder01.address)).to.equal(0);
    });
  });
});
