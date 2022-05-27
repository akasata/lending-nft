import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, ContractFactory } from "ethers";

describe("BorrowableNFT", function () {
  let signer00: SignerWithAddress;
  let signer01: SignerWithAddress;
  let signer02: SignerWithAddress;
  let BorrowableNFT: ContractFactory;
  let borrowableNFT: Contract;

  describe("URI", function () {
    before(async () => {
      [signer00, signer01, signer02] = await ethers.getSigners();

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
        await borrowableNFT.connect(signer00).mint(signer00.address)
      ).wait();
      expect(await borrowableNFT.totalSupply()).to.equal(1);
      expect(await borrowableNFT.tokenURI(0)).to.equal(
        "https://example.com/nfts/0"
      );
      expect(await borrowableNFT.balanceOf(signer00.address)).to.equal(1);

      // mint
      await (
        await borrowableNFT.connect(signer00).mint(signer00.address)
      ).wait();
      expect(await borrowableNFT.totalSupply()).to.equal(2);
      expect(await borrowableNFT.tokenURI(1)).to.equal(
        "https://example.com/nfts/1"
      );
      expect(await borrowableNFT.balanceOf(signer00.address)).to.equal(2);
    });

    it("Contract URI", async function () {
      expect(await borrowableNFT.contractURI()).to.equal(
        "https://example.com/contracts/1"
      );
    });
  });

  describe("Borrow NFT", function () {
    before(async () => {
      [signer00, signer01, signer02] = await ethers.getSigners();

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
        await borrowableNFT.connect(signer00).mint(signer00.address)
      ).wait();
      await (
        await borrowableNFT.connect(signer00).mint(signer00.address)
      ).wait();
    });

    it("Borrow NFT", async function () {
      expect(await borrowableNFT.lendingCount(1)).to.equal(0);

      const borrow1Tx = await borrowableNFT.connect(signer01).borrow(1);
      await borrow1Tx.wait();

      expect(await borrowableNFT.ownerOf(1)).to.equal(signer00.address);
      expect(await borrowableNFT.balanceOf(signer00.address)).to.equal(1);
      expect(await borrowableNFT.balanceOf(signer01.address)).to.equal(1);
      expect(await borrowableNFT.lendingCount(1)).to.equal(1);

      // transfer
      const transfer1Tx = await borrowableNFT
        .connect(signer00)
        .transferFrom(signer00.address, signer02.address, 1);
      await transfer1Tx.wait();

      expect(await borrowableNFT.ownerOf(1)).to.equal(signer02.address);
      expect(await borrowableNFT.balanceOf(signer00.address)).to.equal(1);
      expect(await borrowableNFT.balanceOf(signer01.address)).to.equal(1);
      expect(await borrowableNFT.balanceOf(signer02.address)).to.equal(0);
    });
  });
});
