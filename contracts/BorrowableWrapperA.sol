// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./BaseNFTA.sol";

contract BorrowableWrapperA is IERC721, Ownable {
    error NotImplemented();

    event Borrow(address indexed borrower, address indexed owner, uint256 indexed tokenId, uint256 limit);

    BaseNFTA private nftContract;
    mapping(uint256 => address) private _borrowers;
    mapping(address => uint256) private _borrowingLimits;
    mapping(uint256 => uint256) private _borrowingCount;

    constructor(address nftAddress) {
        nftContract = BaseNFTA(nftAddress);
    }

    function borrow(uint256 tokenId) public virtual {
        address tokenOwner = nftContract.ownerOf(tokenId);
        address borrower = msg.sender;

        require(tokenOwner != address(0), "No owner");
        require(borrower != address(0), "No borrower");
        require(tokenOwner != owner(), "If the Token holder is Contract Owner, it cannot be lent.");
        require(tokenOwner != borrower, "The lender and the borrower are the same person");
        require(_borrowers[tokenId] == address(0) || _borrowingLimits[borrower] < block.timestamp, "Someone has already borrowed");
        require(balanceOf(borrower) == 0, "Borrower has already owned or borrowed");

        uint256 limit = block.timestamp + 15 minutes;
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

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes calldata data
    ) external override {
        revert NotImplemented();
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external override {
        revert NotImplemented();
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external override {
        revert NotImplemented();
    }

    function approve(address to, uint256 tokenId) external override {
        revert NotImplemented();
    }


    function setApprovalForAll(address operator, bool _approved) external override {
        revert NotImplemented();
    }


    function getApproved(uint256 tokenId) external view override returns (address operator) {
        revert NotImplemented();
    }

    function isApprovedForAll(address owner, address operator) external view override returns (bool) {
        revert NotImplemented();
    }

    // ==============================
    //            IERC165
    // ==============================
    function supportsInterface(bytes4 interfaceId) external view returns (bool) {
        return nftContract.supportsInterface(interfaceId);
    }
}
