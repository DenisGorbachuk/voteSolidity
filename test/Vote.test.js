const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("Vote", function() {
    let owner
    let voter1
    let voter2
    let voter3
    let cand1
    let cand2
    let cand3

    beforeEach(async function() {
        [owner, voter1, voter2, voter3, cand1, cand2, cand3] = await ethers.getSigners()
        const Vote = await ethers.getContractFactory("Vote", owner)
        vote = await Vote.deploy()
        await vote.deployed()
    })

    async function getTimestamp(bn) {
        return (
            await ethers.provider.getBlock(bn)
        ).timestamp
    }

    describe("createVote", function() {
        it("creates vote success", async function() {
            
        })
    })
})