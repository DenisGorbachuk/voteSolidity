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
    let voter4

    beforeEach(async function() {
        [owner, voter1, voter2, voter3, voter4, cand1, cand2, cand3] = await ethers.getSigners()        
        const Vote = await ethers.getContractFactory("Voting", owner)
        vote = await Vote.deploy()
        await vote.deployed()
    })

    describe("createVote", function() {
        it("only owner can create voting", async function () {
            await expect(
                vote.connect(voter1).createVote(
                    [cand1.address, cand2.address]
                )
            ).to.be.revertedWith("only owner");

            await vote.createVote(
                [cand1.address, cand2.address]
            )
            const countVotes = await vote.getCountVotes();
            expect(countVotes).to.eq(1);
        })
    })
    
        it("vote", async function() {
            const ENTRANCEFEE =  ethers.utils.parseEther("0.01")
            await vote.createVote(
                [cand1.address, cand2.address, cand3.address]
            )
            expect(await vote.getCountsOfcandidatsVotes(0, cand2.address)).to.eq(0)

            await vote.vote(
                0,
                cand2.address,
                {value: ENTRANCEFEE}       
            )        
            expect(await vote.getCountsOfcandidatsVotes(0, cand2.address)).to.eq(1)  
            
            await expect(vote.vote(
                0,
                cand3.address,
                {value: ENTRANCEFEE}       
            )).to.be.revertedWith("you have already voted")
        })

        it("stopping vote", async function() {
            const ENTRANCEFEE =  ethers.utils.parseEther("0.01")
            await vote.createVote(
                [cand1.address, cand2.address, cand3.address]                                      
            )
            
            await vote.vote(
                0,
                cand2.address,
                {value: ENTRANCEFEE}       
            ) 

            await expect(vote.stopVote(0)).to.be.revertedWith("it's not time to stop voting yet!")

            await network.provider.send("evm_increaseTime", [3600 * 24 * 3 + 1])
            await network.provider.send("evm_mine")

            await vote.stopVote(0);

            await expect(vote.connect(voter2).vote(
                0,
                cand3.address,
                {value: ENTRANCEFEE}       
            )).to.be.revertedWith("voting is over")
        })

        it("withdrawoWinerAndOwner", async function() {
            const ENTRANCEFEE =  ethers.utils.parseEther("0.01")
            const notEnoughENTRANCEFEE = ethers.utils.parseEther("0.001")
            const moreENTRANCEFEE = ethers.utils.parseEther("0.1")
            await vote.createVote(
                [cand1.address, cand2.address, cand3.address]                                      
            )
            
            await vote.vote(
                0,
                cand2.address,
                {value: ENTRANCEFEE}       
            ) 

            await vote.connect(voter3).vote(
                0,
                cand2.address,
                {value: ENTRANCEFEE}       
            ) 

            await vote.connect(voter2).vote(
                0,
                cand3.address,
                {value: ENTRANCEFEE}       
            ) 

            await vote.connect(voter1).vote(
                0,
                cand1.address,
                {value: ENTRANCEFEE}       
            ) 

            await expect(vote.connect(voter4).vote(
                0,
                cand1.address,
                {value: notEnoughENTRANCEFEE}       
            )).to.be.revertedWith("not enough funds")

            await vote.connect(cand2).vote(
                0,
                cand3.address,
                {value: moreENTRANCEFEE}       
            )

            await network.provider.send("evm_increaseTime", [3600 * 24 * 3 + 1])
            await network.provider.send("evm_mine")
            await expect(vote.withdrawFEE(0)).to.be.revertedWith("voting is not over yet")        
            
            await vote.stopVote(0)

            let balanceContractAfterStop = await vote.connect(voter3).getContractBalance()
            
            const withdrawTx = await vote.withdrawFEE(0);

            await expect(() => withdrawTx).to.changeEtherBalance(owner, balanceContractAfterStop)

            expect(await vote.win(0)).to.eq(cand2.address)
            
            const masPart = await vote.participants(0)
            expect(masPart[1]).to.eq(voter3.address)

        })
})