import { expect } from "chai";
import { ethers } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract, ContractFactory } from "ethers";

describe("LendingNFT", function () {
  let signer00: SignerWithAddress;
  let signer01: SignerWithAddress;
  let signer02: SignerWithAddress;
  let LendingNFT: ContractFactory;
  let lendingNFT: Contract;

  describe("URI", function () {
    before(async () => {
      [signer00, signer01, signer02] = await ethers.getSigners();

      LendingNFT = await ethers.getContractFactory("LendingNFT");
      lendingNFT = await LendingNFT.deploy(
        "LendingNFT",
        "LENDNFT",
        "https://example.com/nfts/",
        "https://example.com/contracts/1"
      );
      await lendingNFT.deployed();
    });

    it("mint and get TokenURI", async function () {
      // mint
      await (await lendingNFT.connect(signer00).mint(signer00.address)).wait();
      expect(await lendingNFT.totalSupply()).to.equal(1);
      expect(await lendingNFT.tokenURI(0)).to.equal(
        "https://example.com/nfts/0"
      );
      expect(await lendingNFT.balanceOf(signer00.address)).to.equal(1);

      // mint
      await (await lendingNFT.connect(signer00).mint(signer00.address)).wait();
      expect(await lendingNFT.totalSupply()).to.equal(2);
      expect(await lendingNFT.tokenURI(1)).to.equal(
        "https://example.com/nfts/1"
      );
      expect(await lendingNFT.balanceOf(signer00.address)).to.equal(2);
    });

    it("Contract URI", async function () {
      expect(await lendingNFT.contractURI()).to.equal(
        "https://example.com/contracts/1"
      );
    });
  });

  describe("Borrow NFT", function () {
    before(async () => {
      [signer00, signer01, signer02] = await ethers.getSigners();

      LendingNFT = await ethers.getContractFactory("LendingNFT");
      lendingNFT = await LendingNFT.deploy(
        "LendingNFT",
        "LENDNFT",
        "https://example.com/nfts/",
        "https://example.com/contracts/1"
      );
      await lendingNFT.deployed();

      // mint
      await (await lendingNFT.connect(signer00).mint(signer00.address)).wait();
      await (await lendingNFT.connect(signer00).mint(signer00.address)).wait();
    });

    it("Borrow NFT", async function () {
      const borrow1Tx = await lendingNFT.connect(signer01).borrow(1);
      await borrow1Tx.wait();

      expect(await lendingNFT.ownerOf(1)).to.equal(signer00.address);
      expect(await lendingNFT.balanceOf(signer00.address)).to.equal(1);
      expect(await lendingNFT.balanceOf(signer01.address)).to.equal(1);

      // transfer
      const transfer1Tx = await lendingNFT
        .connect(signer00)
        .transferFrom(signer00.address, signer02.address, 1);
      await transfer1Tx.wait();

      expect(await lendingNFT.ownerOf(1)).to.equal(signer02.address);
      expect(await lendingNFT.balanceOf(signer00.address)).to.equal(1);
      expect(await lendingNFT.balanceOf(signer01.address)).to.equal(1);
      expect(await lendingNFT.balanceOf(signer02.address)).to.equal(0);
    });
  });
});
