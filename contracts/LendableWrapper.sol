// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "erc721a/contracts/extensions/IERC721AQueryable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Borrowing.sol";

contract LendableWrapper is IERC721, Ownable {
    error NotImplemented();

    event Lend(address indexed borrower, address indexed owner, uint256 indexed tokenId, uint256 lendingPeriodEndTimestamp);

    Borrowing private _borrowing;
    IERC721AQueryable private _baseNft;
    address private _firstSeller;

    constructor(address baseNftAddress, address firstSeller, uint256 lendingPeriodMin) {
        _borrowing = new Borrowing(address(this), lendingPeriodMin);
        _baseNft = IERC721AQueryable(baseNftAddress);
        _firstSeller = firstSeller;
    }

    function lend(uint256 tokenId, address borrower) public virtual {
        address lender = msg.sender;
        address tokenOwner = _baseNft.ownerOf(tokenId);
        address currentBorrower = _borrowing.getBorrower(tokenId);
        uint256 now = block.timestamp;

        // check TokenOwner
        require(tokenOwner != address(0), "No owner");
        require(tokenOwner != _firstSeller, "If the Token holder is first seller, it cannot be lent.");

        // check Lender
        require(lender != address(0), "No lender");
        require(lender == tokenOwner, "Not owned by the lender.");
        require(lender != borrower, "The lender and the borrower are the same person");

        // check borrower
        require(balanceOf(borrower) == 0, "Borrower has already owned or borrowed");

        // check lendable
        require(_borrowing.canBorrow(tokenId, now), "already borrowed");

        _borrowing.setBorrower(tokenId, borrower, now);
        emit Lend(borrower, tokenOwner, tokenId, _borrowing.getBorrowingPeriodEnds(borrower));
    }

    function lentCount(uint256 tokenId) public view virtual returns (uint256) {
        return _borrowing.borrowedCount(tokenId);
    }

    function canLend(uint256 tokenId, address borrower) public view virtual returns (bool) {
        return _borrowing.canBorrow(tokenId, block.timestamp) && balanceOf(borrower) == 0;
    }

    function totalSupply() external view returns (uint256) {
        return _baseNft.totalSupply();
    }

    // ==============================
    //            IERC721
    // ==============================
    function balanceOf(address owner) public view virtual override returns (uint256) {
        if (_borrowing.isBorrowed(owner, block.timestamp)) {
            return 1;
        } else {
            uint256 balance = 0;
            uint256[] memory tokenIds = _baseNft.tokensOfOwner(owner);
            for (uint i; i < tokenIds.length; i++) {
                uint256 tokenId = tokenIds[i];
                address borrower = _borrowing.getBorrower(tokenId);
                if (borrower == address(0) || !_borrowing.isBorrowed(borrower, block.timestamp)) {
                    balance++;
                }
            }
            return balance;
        }
    }

    function ownerOf(uint256 tokenId) external view override returns (address owner) {
        return _baseNft.ownerOf(tokenId);
    }

    function safeTransferFrom(address, address, uint256, bytes calldata) external override {
        revert NotImplemented();
    }

    function safeTransferFrom(address, address, uint256) external override {
        revert NotImplemented();
    }

    function transferFrom(address, address, uint256) external override {
        revert NotImplemented();
    }

    function approve(address, uint256) external override {
        revert NotImplemented();
    }


    function setApprovalForAll(address, bool) external override {
        revert NotImplemented();
    }


    function getApproved(uint256) external view override returns (address) {
        revert NotImplemented();
    }

    function isApprovedForAll(address, address) external view override returns (bool) {
        revert NotImplemented();
    }

    // ==============================
    //            IERC165
    // ==============================
    function supportsInterface(bytes4 interfaceId) external view returns (bool) {
        // ERC165 interface ID for ERC165 and ERC721.
        return interfaceId == 0x01ffc9a7 || interfaceId == 0x80ac58cd;
    }
}
