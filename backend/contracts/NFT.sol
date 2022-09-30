// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.7;

import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';

contract NFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  address contractAddress;
  event NFTMinted(uint256);

  uint256 public constant MAX_SUPPLY = 100;
  string public baseURI =
    'ipfs://bafybeigtohdkrndj7jghq3yligoiqnvsz4vsmwfpga7ri7hgp6e2klzs7m/';

  constructor(address marketplaceAddress) ERC721('Planet Runner', 'PR') {
    contractAddress = marketplaceAddress;
  }

  function createToken() public returns (uint256) {
    require(MAX_SUPPLY > _tokenIds.current() + 1, 'Exceeds max supply');
    _tokenIds.increment();
    uint256 newTokenId = _tokenIds.current();

    _mint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, tokenURI(newTokenId));
    setApprovalForAll(contractAddress, true);
    emit NFTMinted(newTokenId);
    return newTokenId;
  }

  function transferToken(
    address from,
    address to,
    uint256 tokenId
  ) external {
    require(ownerOf(tokenId) == from, 'From address must be token owner');
    _transfer(from, to, tokenId);
  }

  function getContractAddress() public view returns (address) {
    return contractAddress;
  }

  function currentSupply() public view returns (uint256) {
    return _tokenIds.current();
  }

  function tokenURI(uint256 _tokenId)
    public
    view
    override
    returns (string memory)
  {
    require(_exists(_tokenId), 'Token does not exist.');
    return
      bytes(baseURI).length > 0
        ? string(
          abi.encodePacked(baseURI, Strings.toString(_tokenId - 1), '.json')
        )
        : '';
  }
}
