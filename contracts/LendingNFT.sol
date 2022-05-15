// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LendingNFT is ERC721PresetMinterPauserAutoId, Ownable {
    event Borrow(address indexed borrower, address indexed owner, uint256 indexed tokenId, uint256 limit);

    mapping(uint256 => address) private _borrowers;
    mapping(address => uint256) private _borrowingLimits;
    mapping(uint256 => uint256) private _borrowingCount;
    string private _contractURI;

    constructor(string memory name, string memory symbol, string memory baseTokenURI, string memory initContractURI)
        ERC721PresetMinterPauserAutoId(name, symbol, baseTokenURI) {
        _contractURI = initContractURI;
    }

    function contractURI() public view returns (string memory) {
        return _contractURI;
    }

    function borrow(uint256 tokenId) public virtual {
        address owner = ERC721.ownerOf(tokenId);
        address borrower = msg.sender;

        require(owner != address(0), "No owner");
        require(borrower != address(0), "No borrower");
        require(owner != borrower, "The lender and the borrower are the same person");
        require(_borrowers[tokenId] == address(0) || _borrowingLimits[borrower] < block.timestamp, "Someone has already borrowed");
        require(balanceOf(borrower) == 0, "Borrower has already owned or borrowed");

        uint256 limit = block.timestamp + 15 minutes;
        _borrowers[tokenId] = borrower;
        _borrowingLimits[borrower] = limit;
        _borrowingCount[tokenId]++;

        emit Borrow(borrower, owner, tokenId, limit);
    }

    function _isBorrowing(address borrower) internal view virtual returns(bool) {
        return _borrowingLimits[borrower] > block.timestamp;
    }

    function _borrowedBalanceOf(address borrower) internal view virtual returns(uint256) {
        return _isBorrowing(borrower) ? 1 : 0;
    }

    function balanceOf(address owner) public view virtual override returns (uint256) {
        uint256 borrowedBalance = _borrowedBalanceOf(owner);

        if (borrowedBalance > 0) {
            return borrowedBalance;
        } else {
            uint256 balance = 0;
            for (uint i; i < ERC721.balanceOf(owner); i++) {
                uint256 tokenId = ERC721Enumerable.tokenOfOwnerByIndex(owner, i);
                if (_borrowers[tokenId] == address(0) || !_isBorrowing(_borrowers[tokenId])) {
                    balance++;
                }
            }
            return balance;
        }
    }

    function lendingCount(uint256 tokenId) public view virtual returns (uint256) {
        return _borrowingCount[tokenId];
    }

    function burn(uint256 tokenId) public virtual override {
        super.burn(tokenId);

        address borrower = _borrowers[tokenId];
        delete _borrowingLimits[borrower];
        delete _borrowers[tokenId];
    }
}