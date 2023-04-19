// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTree is ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;
    uint256 public mintingFee;

    // Mapping of token ID to carbon offset project
    mapping(uint256 => string) public carbonOffsetProjects;

    constructor(uint256 _mintingFee) ERC721("NFTree", "NFT") {
        mintingFee = _mintingFee;
    }

    function mintNFT(address to, string memory tokenURI, string memory carbonOffsetProject) public payable {
        require(msg.value >= mintingFee, "NFTree: Minting fee is not enough.");

        _tokenIdCounter += 1;
        uint256 tokenId = _tokenIdCounter;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        carbonOffsetProjects[tokenId] = carbonOffsetProject;

        // Send the minting fee to the carbon offset project
        payable(owner()).transfer(msg.value);
    }

    function updateMintingFee(uint256 newFee) public onlyOwner {
        mintingFee = newFee;
    }
}
