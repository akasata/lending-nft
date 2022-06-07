# LendingNFT

LendingNFT is a smart contract that realizes lending and borrowing of NFT.

The purpose of this repository is to provide BorrowableNFT that people who do not have NFTs can freely borrow NFTs, 
and Lendable NFT that can be rented by NFT owners.

Currently only BorrowableNFT is implemented.

# Getting started

- `npm i`
- create `.env` file. See `.env.example`

# Commands

- `npm run` 

# BorrowableNFT

Borrowable NFT provides a mechanism that allows people who do not have NFTs to borrow NFTs freely.
Borrowable NFT implements the following two Contracts.

- BaseNFT
- BorrowableWrapper

BaseNFT is a regular NFT Contract that inherits from ERC721AQueryable.

BorrowableWrapper has two features. 
One implements an ERC721 interface and acts as a wrapper for the Base NFT, and the other implements a borrow function for people who don't have an NFT to borrow an NFT.

When the borrower calls the BorrowableWrapper#borrow(uint tokenId) function, the borrower's balance is incremented by 1 and the owner's balance is decremented by 1.
After the period specified in the Contract (1 day by default), the NFT is returned to the owner, the borrower's balance is -1 and the owner's balance is +1.

This mechanism allows BorrowableWrapper to be used in content gates to provide an NFT renting experience.

# TODO

- [ ] Make BorrowableWrapper dependent on ERC721AQueryable or ERC721Enumerable instead of BaseNFT
- [ ] Implementation of Lendable Wrapper that realizes NFT lending
- [ ] Add deploy and usage documentation

# About

This Smart Contract is an OSS version of `A Wizard of Tono` Book NFT.

（ここに主に関わったメンバーの一覧を追加します）
