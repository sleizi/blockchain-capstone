

var Verifier = artifacts.require('Verifier');
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

const truffleAssert = require('truffle-assertions');

const Proof = require("./proof/proof.json");

contract('TestSolnSquareVerifier', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    
    const name = "Real Estate NFT";
    const symbol = "REN";

    describe('test solnSquareVerifier', function () {
        before(async function () {

            let verifierContract = await Verifier.new({ from: account_one });

            this.contract = await SolnSquareVerifier.new(verifierContract.address, name, symbol, { from: account_one });

        });

        // Test if a new solution can be added for contract - SolnSquareVerifier
        it('should add new solution', async function () {

            let result = await this.contract.addSolution(Proof.proof.a, Proof.proof.b, Proof.proof.c, Proof.inputs, { from: account_one });

            truffleAssert.eventEmitted(result, 'SolutionAdded', (ev) => {
                return ev.solutionIndex == 0;
            });
        });

        // Test if an ERC721 token can be minted for contract - SolnSquareVerifier
        it('should mint token', async function () {
            let eventEmitted = false;

            await this.contract.Transfer((err, res) => {
                eventEmitted = true;
            });

            await this.contract.mintNFT(account_two, 0, Proof.inputs, { from: account_one });

            assert.equal(eventEmitted, true, 'Token not minted');

            let balance = await this.contract.balanceOf(account_two);
            assert.equal(balance, 1, "Incorrect token balance");
        });


    });

});