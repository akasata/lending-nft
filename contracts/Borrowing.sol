// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Borrowing {
    address _wrapper;
    mapping(uint256 => address) private _borrowers;
    mapping(address => uint256) private _borrowingPeriodEnds;
    mapping(uint256 => uint256) private _borrowingCount;

    constructor(address wrapper) {
        _wrapper = wrapper;
    }

    modifier onlyWrapper() {
        require(_wrapper == msg.sender, "Borrowing: caller is not the wrapper");
        _;
    }

    function isBorrowed(address borrower, uint256 timestamp) public view virtual returns(bool) {
        return _borrowingPeriodEnds[borrower] > timestamp;
    }

    function getBorrowingPeriodEnds(address borrower) public view virtual returns(uint256) {
        return _borrowingPeriodEnds[borrower];
    }

    function getBorrower(uint256 tokenId) public view virtual returns(address) {
        return _borrowers[tokenId];
    }

    function canBorrow(uint256 tokenId, uint256 timestamp) public view virtual returns(bool) {
        address currentBorrower = getBorrower(tokenId);

        return currentBorrower == address(0) || isBorrowed(currentBorrower, timestamp);
    }

    function borrowedCount(uint256 tokenId) public view virtual returns(uint256) {
        return _borrowingCount[tokenId];
    }

    function setBorrower(uint256 tokenId, address borrower, uint64 expires) public virtual onlyWrapper {
        uint256 periodEnd = expires;
        _borrowers[tokenId] = borrower;
        _borrowingPeriodEnds[borrower] = periodEnd;
        _borrowingCount[tokenId]++;
    }
}