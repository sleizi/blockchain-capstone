var CustomERC721Token = artifacts.require("CustomERC721Token");
var Verifier = artifacts.require("Verifier");
var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");

module.exports = function (deployer) {
  deployer.then(async () => {
    await deployer.deploy(CustomERC721Token, "Real Estate NFT", "REN");
    await deployer.deploy(Verifier);
    await deployer.deploy(SolnSquareVerifier, Verifier.address, "Real Estate NFT", "REN");
  });
};