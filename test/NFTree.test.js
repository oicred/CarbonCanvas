const { expect } = require("chai");
const { ethers } = require("@nomiclabs/hardhat-ethers");
const { BN, expectEvent, expectRevert } = require("@openzeppelin/test-helpers");
const { Contract } = require("@ethersproject/contracts");

const NFTree = artifacts.require("NFTree");

describe("NFTree", function () {
  const [owner, user1, user2] = accounts;
  const projectName = "Carbon Offset Project";
  const projectOffsetAmount = new BN("1000000000000000000"); // 1 Ether
  const tokenURI = "https://example.com/nft/1";
  const initialProjectId = 0;

  beforeEach(async function () {
    this.nftree = await NFTree.new({ from: owner });
    await this.nftree.addCarbonOffsetProject(projectName, projectOffsetAmount, { from: owner });
  });

  it("addCarbonOffsetProject", async function () {
    const result = await this.nftree.addCarbonOffsetProject("New Project", projectOffsetAmount, { from: owner });
    expectEvent(result, "CarbonOffsetProjectAdded", { name: "New Project", offsetAmount: projectOffsetAmount });
  });

  it("mintNFT", async function () {
    const value = projectOffsetAmount;
    const result = await this.nftree.mintNFT(user1, tokenURI, initialProjectId, { from: user1, value });

    expectEvent(result, "Transfer", { from: ethers.constants.AddressZero, to: user1, tokenId: new BN(1) });

    const ownerOfToken = await this.nftree.ownerOf(new BN(1));
    expect(ownerOfToken).to.equal(user1);

    const tokenURIResult = await this.nftree.tokenURI(new BN(1));
    expect(tokenURIResult).to.equal(tokenURI);
  });

  it("rejects insufficient value for minting NFT", async function () {
    await expectRevert(
      this.nftree.mintNFT(user1, tokenURI, initialProjectId, { from: user1, value: projectOffsetAmount.subn(1) }),
      "Insufficient funds to support project"
    );
  });

  it("rejects minting with invalid project ID", async function () {
    await expectRevert(
      this.nftree.mintNFT(user1, tokenURI, 99, { from: user1, value: projectOffsetAmount }),
      "Invalid project ID"
    );
  });
});
