// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "erc721a/contracts/extensions/ERC721AQueryable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BaseNFTA is IERC721AQueryable, ERC721AQueryable, Ownable {
    string private _baseTokenURI;
    string private _contractURI;

    constructor(string memory name, string memory symbol, string memory baseTokenURI, string memory initContractURI)
    ERC721A(name, symbol) {
        _contractURI = initContractURI;
        _baseTokenURI = baseTokenURI;
    }

    function _startTokenId() internal view override returns (uint256) {
        return 1;
    }

    function contractURI() public view returns (string memory) {
        return _contractURI;
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
}