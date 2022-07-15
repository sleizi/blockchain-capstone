var CustomERC721Token = artifacts.require('CustomERC721Token');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    const name = "Real Estate NFT";
    const symbol = "REN";
    const baseTokenURI = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/";

    describe('match erc721 spec', function () {
        beforeEach(async function () {
            this.contract = await CustomERC721Token.new(name, symbol, { from: account_one });

            // TODO: mint multiple tokens
            for (let i = 0; i <= 5; i++) {
                await this.contract.mint(account_two, i, { from: account_one });
            }
        })

        it('should return total supply', async function () {
            assert.equal(await this.contract.totalSupply(), 6, "Incorrect total supply");
        })

        it('should get token balance', async function () {
            assert.equal(await this.contract.balanceOf(account_two), 6, "Incorrect balance");
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            let uriReturned = await this.contract.tokenURI(1);
            let completedURI = baseTokenURI + "1";
            assert.equal(uriReturned, completedURI, "Incorrect URI");
        })

        it('should transfer token from one owner to another', async function () {
            await this.contract.transferFrom(account_two, account_three, 1, { from: account_two });
            assert.equal(await this.contract.ownerOf(1), account_three, "Token is not tranferred");
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            this.contract = await CustomERC721Token.new(name, symbol, { from: account_one });
        })

        it('should fail when minting when address is not contract owner', async function () {
            let result = false;
            try {
                result = await this.contract.mint(account_two, 1, { from: account_two });
            } catch (e) { }

            assert.equal(result, false, "Address is able to mint when it is not the contract owner");
        })

        it('should return contract owner', async function () {
            assert.equal(await this.contract.getOwner(), account_one, "Incorrect contract owner");
        })

    });

})