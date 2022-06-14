// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "erc721a/contracts/extensions/ERC721AQueryable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BaseNFT is IERC721AQueryable, ERC721AQueryable, Ownable {
    string private _baseTokenURI;

    constructor(string memory name, string memory symbol, string memory baseTokenURI)
    ERC721A(name, symbol) {
        _baseTokenURI = baseTokenURI;
    }

    function _startTokenId() internal view override returns (uint256) {
        return 1;
    }

    function mint(address to, uint256 quantity) public virtual onlyOwner {
        _mint(to, quantity);
    }

    function burn(uint256 tokenId) public virtual onlyOwner {
        _burn(tokenId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function bulkTransfer(address[] memory targets, uint256 startId) public virtual {
        address owner = msg.sender;
        for (uint i; i < targets.length; i++) {
            transferFrom(owner, targets[i], startId + i);
        }
    }
}
