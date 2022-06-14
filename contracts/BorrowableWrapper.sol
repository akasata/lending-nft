// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./BaseNFT.sol";

contract BorrowableWrapper is IERC721, Ownable {
    error NotImplemented();

    event Borrow(address indexed borrower, address indexed owner, uint256 indexed tokenId, uint256 limit);

    BaseNFT private nftContract;
    mapping(uint256 => address) private _borrowers;
    mapping(address => uint256) private _borrowingLimits;
    mapping(uint256 => uint256) private _borrowingCount;
    uint256 private _lendingPeriodMin;

    constructor(address nftAddress, uint256 lendingPeriodMin) {
        nftContract = BaseNFT(nftAddress);
        _lendingPeriodMin = lendingPeriodMin;
    }

    function borrow(uint256 tokenId) public virtual {
        address tokenOwner = nftContract.ownerOf(tokenId);
        address borrower = msg.sender;

        require(tokenOwner != address(0), "No owner");
        require(borrower != address(0), "No borrower");
        require(tokenOwner != 0x8AE5d42c55a9a5EcBbc917613b3174D158D78A6b, "If the Token holder is First Seller, it cannot be lent.");
        require(tokenOwner != borrower, "The lender and the borrower are the same person");
        require(_borrowers[tokenId] == address(0) || _borrowingLimits[borrower] < block.timestamp, "Someone has already borrowed");
        require(balanceOf(borrower) == 0, "Borrower has already owned or borrowed");

        uint256 limit = block.timestamp + _lendingPeriodMin * 1 minutes;
        _borrowers[tokenId] = borrower;
        _borrowingLimits[borrower] = limit;
        _borrowingCount[tokenId]++;

        emit Borrow(borrower, tokenOwner, tokenId, limit);
    }

    function _isBorrowing(address borrower) internal view virtual returns(bool) {
        return _borrowingLimits[borrower] > block.timestamp;
    }

    function _borrowedBalanceOf(address borrower) internal view virtual returns(uint256) {
        return _isBorrowing(borrower) ? 1 : 0;
    }

    function lendingCount(uint256 tokenId) public view virtual returns (uint256) {
        return _borrowingCount[tokenId];
    }

    function totalSupply() external view returns (uint256) {
        return nftContract.totalSupply();
    }

    // ==============================
    //            IERC721
    // ==============================
    function balanceOf(address owner) public view virtual override returns (uint256) {
        uint256 borrowedBalance = _borrowedBalanceOf(owner);

        if (borrowedBalance > 0) {
            return borrowedBalance;
        } else {
            uint256 balance = 0;
            uint256[] memory tokenIds = nftContract.tokensOfOwner(owner);
            for (uint i; i < tokenIds.length; i++) {
                uint256 tokenId = tokenIds[i];
                if (_borrowers[tokenId] == address(0) || !_isBorrowing(_borrowers[tokenId])) {
                    balance++;
                }
            }
            return balance;
        }
    }

    function ownerOf(uint256 tokenId) external view override returns (address owner) {
        return nftContract.ownerOf(tokenId);
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
