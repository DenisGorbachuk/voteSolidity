task("createVote", "add create voting")
  .addParam("voteContractAddress", "address contract rinkeby")
  .addParam("candidates", "array of candidates")
  .setAction(async (taskArgs) => {
    const Vote = await ethers.getContractFactory("Voting");
    const vote = await Vote.attach(taskArgs.voteContractAddress);
    
    await vote.createVote(taskArgs.candidates.split(',')); 
    const votingId = await vote.getCountVotes() - 1;  
    console.log("id of voting: " + votingId);
});

task("vote", "vote for a candidate")
  .addParam("voteContractAddress", "voteContractAddress")
  .addParam("votingId", "ID of voting")
  .addParam("candidate", "address of candidate")
  .setAction(async (taskArgs) => {
    const Vote = await ethers.getContractFactory("Voting");
    const vote = await Vote.attach(taskArgs.voteContractAddress);
    const VOTEPRICE = ethers.utils.parseEther("0.01");

    await vote.vote(taskArgs.votingId, taskArgs.candidate , {value: VOTEPRICE } )
});

task("stopVote", "stopping the voting")
  .addParam("voteContractAddress", "voteContractAddress")
  .addParam("votingId", "ID of voting")
  .setAction(async (taskArgs) => {
    const Vote = await ethers.getContractFactory("Voting");
    const vote = await Vote.attach(taskArgs.voteContractAddress);

    await vote.stopVote(taskArgs.votingId)
});

task("withdrawn", "withdrawn fee")
  .addParam("voteContractAddress", "voteContractAddress")
  .addParam("votingId", "ID of voting")
  .addParam("to", "address to which to send")
  .setAction(async (taskArgs) => {
    const Vote = await ethers.getContractFactory("Voting");
    const vote = await Vote.attach(taskArgs.voteContractAddress);

    await vote.withdrawFEE(taskArgs.votingId, taskArgs.to)
});