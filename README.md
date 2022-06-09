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

## TODO

- [ ] Make BorrowableWrapper dependent on ERC721AQueryable or ERC721Enumerable instead of BaseNFT
- [ ] Implementation of Lendable Wrapper that realizes NFT lending
- [ ] Add deploy and usage documentation

## BorrowableNFT Demo

You can actually experience BorrowableNFT with [A Wizard of Tono NFT](https://opensea.io/collection/a-wizard-of-tono) that applies this mechanism. 

1. Access [BorrowableWrapper contract page(EtherScan)](https://etherscan.io/address/0xdbacF8A3591DB696783D174AB8FF773a778B23fb)

2. Open "Contract" tab

![Open "Contract" tab](https://gateway.pinata.cloud/ipfs/Qmcv7YGrD2ALAqPgfw5wUef7BkuBE2u6dEYMPLcAoBoyrD/es_001.png)

3. Select "Write Contract"

![Select "Write Contract"](https://gateway.pinata.cloud/ipfs/Qmcv7YGrD2ALAqPgfw5wUef7BkuBE2u6dEYMPLcAoBoyrD/es_002.png)

4. Connect your Wallet

![Connect your Wallet](https://gateway.pinata.cloud/ipfs/Qmcv7YGrD2ALAqPgfw5wUef7BkuBE2u6dEYMPLcAoBoyrD/es_003.png)

5. Open "borrow", input tokenId and push "Write"(Gas fees are required at this timing.)

![start transaction](https://gateway.pinata.cloud/ipfs/Qmcv7YGrD2ALAqPgfw5wUef7BkuBE2u6dEYMPLcAoBoyrD/es_004.png)

Now you can use this NFT for 24 hours!
Access [token-gated website](https://mgate.io/go/5IZXnD5UBDD-), you can download the e-book in either EPUB, mobi or PDF.

# About

This Smart Contract is an OSS version of `A Wizard of Tono` Book NFT.

（ここに主に関わったメンバーの一覧を追加します）
