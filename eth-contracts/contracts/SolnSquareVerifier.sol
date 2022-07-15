pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";

// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract Verifier {
    function verifyTx(
        uint256[2] memory,
        uint256[2][2] memory,
        uint256[2] memory,
        uint256[2] memory
    ) public returns (bool);
}

// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is CustomERC721Token {
    Verifier private verifier;

    constructor(
        address verifierAddress,
        string memory name,
        string memory symbol
    ) public CustomERC721Token(name, symbol) {
        verifier = Verifier(verifierAddress);
    }

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 solutionIndex;
        address tokenOwner;
        bool isUsed;
    }

    // TODO define an array of the above struct
    Solution[] private solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) private solutionMap;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 solutionIndex, address tokenOwner);

    // TODO Create a function to add the solutions to the array and emit the event
    function addSolution(
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[2] memory input
    ) public {
        bytes32 solHash = keccak256(abi.encodePacked(input[0], input[1]));
        require(
            solutionMap[solHash].tokenOwner == address(0),
            "Solution has been already added"
        );

        bool verified = verifier.verifyTx(a, b, c, input);
        require(verified, "Solution could not be verified");

        uint256 solutionIndex = solutions.length;

        Solution memory solution = Solution(solutionIndex, msg.sender, false);
        solutions.push(solution);
        solutionMap[solHash] = solution;

        emit SolutionAdded(solutionIndex, msg.sender);
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintNFT(
        address toOwner,
        uint256 tokenId,
        uint256[2] memory input
    ) public {
        bytes32 solHash = keccak256(abi.encodePacked(input[0], input[1]));
        require(
            solutionMap[solHash].tokenOwner != address(0),
            "Solution does not exist yet"
        );

        require(solutionMap[solHash].isUsed == false, "Solution had been used");

        solutionMap[solHash].isUsed == true;
        super.mint(toOwner, tokenId);
    }
}
