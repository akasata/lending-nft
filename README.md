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

You can actually experience BorrowableNFT with [A Wizard of Tono NFT](https://linktr.ee/awizardoftono) that applies this mechanism. 

1. Access [BorrowableWrapper contract page(EtherScan)](https://etherscan.io/address/0xdbacF8A3591DB696783D174AB8FF773a778B23fb)

2. Open "Contract" tab

![Open "Contract" tab](https://user-images.githubusercontent.com/28495/173220168-28dd0e4e-8741-402b-aa95-cf61048ff38d.png)

3. Select "Write Contract"

![Select "Write Contract"](https://user-images.githubusercontent.com/28495/173220172-5517d08d-30b0-4b8d-82e9-6811e147ff19.png)

4. Connect your Wallet

![Connect your Wallet](https://user-images.githubusercontent.com/28495/173220177-dccddd4c-2167-4692-ab24-d0e60386cf29.png)

5. Open "borrow", input tokenId and push "Write"(Gas fees are required at this timing.)

About tokenId: You can specify any tokenId from any NFT sold. You can also search by Twitter's [#youcanborrowawizardoftono](https://twitter.com/search?q=%23youcanborrowawizardoftono) hashtag.

![start transaction](https://user-images.githubusercontent.com/28495/173220194-412a1909-2a9e-41e2-b7de-fc9413042b6d.png)

Note: If your gas fees is unusually high or if you point out a possible error, please refer to the [Troubleshooting](#Troubleshooting).

Now you can use this NFT for 24 hours!
Access [token-gated website](https://mgate.io/go/5IZXnD5UBDD-), you can download the e-book in either EPUB, mobi or PDF.

## Troubleshooting

### An abnormally high gas fees or an error is predicted

If the NFT cannot be borrowed, the following error/alert may be displayed.
(This is a screenshot of Metamask.)

![es_005](https://user-images.githubusercontent.com/28495/173220399-c15c0fce-3cbb-4257-b8cc-5f87be91879f.png)

The following causes are possible.

- Owner of NFT
  - If the NFT Owner wants to try BorrowableNFT, try it on a wallet that doesn't own an NFT.
- NFT has already been borrowed
- NFT not for sale yet

If you want to find a BorrowableNFT tokenId that you can borrow, please search on Twitter [#youcanborrowawizardoftono](https://twitter.com/search?q=%23youcanborrowawizardoftono) hashtag.

# About

This Smart Contract is an OSS version of [A Wizard of Tono Book NFT](https://linktr.ee/awizardoftono).
