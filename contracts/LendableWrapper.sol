// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Borrowing.sol";
import "./IERC4907.sol";

contract LendableWrapper is IERC721, IERC4907, Ownable {
    error NotImplemented();

    event Lend(address indexed borrower, address indexed owner, uint256 indexed tokenId, uint256 expires);

    Borrowing private _borrowing;
    IERC721 private _baseNft;
    address private _firstSeller;

    constructor(address baseNftAddress, address firstSeller) {
        _borrowing = new Borrowing(address(this));
        _baseNft = IERC721(baseNftAddress);
        _firstSeller = firstSeller;
    }

    function lend(uint256 tokenId, address borrower, uint64 expires) public virtual {
        address lender = msg.sender;
        address tokenOwner = _baseNft.ownerOf(tokenId);
        uint256 currentTimestamp = block.timestamp;

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
        require(_borrowing.canBorrow(tokenId, currentTimestamp), "already borrowed");
        require(currentTimestamp < expires, "wrong expires");

        _borrowing.setBorrower(tokenId, borrower, expires);
        emit Lend(borrower, tokenOwner, tokenId, _borrowing.getBorrowingPeriodEnds(borrower));
    }

    function lentCount(uint256 tokenId) public view virtual returns (uint256) {
        return _borrowing.borrowedCount(tokenId);
    }

    function canLend(uint256 tokenId, address borrower) public view virtual returns (bool) {
        return _borrowing.canBorrow(tokenId, block.timestamp) && balanceOf(borrower) == 0;
    }

    // ==============================
    //            IERC721
    // ==============================
    function balanceOf(address owner) public view virtual override returns (uint256) {
        return _baseNft.balanceOf(owner);
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
    //            IERC4907
    // ==============================
    function setUser(uint256 tokenId, address user, uint64 expires) external override {
        lend(tokenId, user, expires);

        emit UpdateUser(tokenId,user,expires);
    }

    function userOf(uint256 tokenId) external view override returns(address) {
        return _borrowing.getBorrower(tokenId);
    }

    function userExpires(uint256 tokenId) external view override returns(uint256) {
        address user = _borrowing.getBorrower(tokenId);

        return _borrowing.getBorrowingPeriodEnds(user);
    }

    // ==============================
    //            IERC165
    // ==============================
    function supportsInterface(bytes4 interfaceId) external view returns (bool) {
        // ERC165 interface ID for ERC165 and ERC721.
        return interfaceId == 0x01ffc9a7 || interfaceId == 0x80ac58cd;
    }
}
