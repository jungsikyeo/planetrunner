// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ERC721A.sol";

contract PlanetRunners is ERC721A, Ownable {
    string public baseURI =
        "ipfs://bafybeigtohdkrndj7jghq3yligoiqnvsz4vsmwfpga7ri7hgp6e2klzs7m/";
    string public contractURI =
        "ipfs://bafybeigtohdkrndj7jghq3yligoiqnvsz4vsmwfpga7ri7hgp6e2klzs7m";

    uint256 public constant MAX_PER_TX_FREE = 2;
    uint256 public FREE_MAX_SUPPLY = 20;
    uint256 public constant MAX_PER_TX = 2;
    uint256 public constant MAX_PER_WALLET = 0;
    uint256 public constant MAX_SUPPLY = 100;
    uint256 public price = 0.005 ether;

    bool public paused = true;

    constructor() ERC721A("Planet Runners", "PR") {}

    function mint(uint256 _amount) external payable {
        address _caller = _msgSender();
        require(!paused, "Paused");
        require(MAX_SUPPLY >= totalSupply() + _amount, "Exceeds max supply");
        require(_amount > 0, "No 0 mints");
        require(tx.origin == _caller, "No contracts");
        require(MAX_PER_TX >= _amount, "Excess max per paid tx");
        require(_amount * price == msg.value, "Invalid funds provided");

        _safeMint(_caller, _amount);
    }

    function freeMint(uint256 _amount) external payable {
        address _caller = _msgSender();
        require(!paused, "Paused");
        require(MAX_SUPPLY >= totalSupply() + _amount, "Exceeds max supply");
        require(tx.origin == _caller, "No contracts");
        require(
            MAX_PER_TX_FREE >= uint256(_getAux(_caller)) + _amount,
            "Excess max per free wallet"
        );
        require(FREE_MAX_SUPPLY - _amount >= 0, "No more free mints, sorry <3");

        unchecked {
            FREE_MAX_SUPPLY -= _amount;
        }
        _setAux(_caller, uint64(_amount));
        _safeMint(_caller, _amount);
    }

    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }

    function minted(address _owner) public view returns (uint256) {
        return _numberMinted(_owner);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        (bool success, ) = _msgSender().call{value: balance}("");
        require(success, "Failed to send");
    }

    function devMint(uint256 _amount) external onlyOwner {
        _safeMint(_msgSender(), _amount);
    }

    function setPrice(uint256 _price) external onlyOwner {
        price = _price;
    }

    function pause(bool _state) external onlyOwner {
        paused = _state;
    }

    function setBaseURI(string memory baseURI_) external onlyOwner {
        baseURI = baseURI_;
    }

    function setContractURI(string memory _contractURI) external onlyOwner {
        contractURI = _contractURI;
    }

    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(_tokenId), "Token does not exist.");
        return
            bytes(baseURI).length > 0
                ? string(
                    abi.encodePacked(
                        baseURI,
                        Strings.toString(_tokenId),
                        ".json"
                    )
                )
                : "";
    }
}
