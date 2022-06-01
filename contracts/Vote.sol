// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public owner;
    uint constant FEE = 10; // %
    uint constant ENTRANCEFEE = 10000000000000000;
    uint constant DURATION = 1 minutes;
    uint countVotes;
    mapping(uint => Vote) votes;

    constructor() {
        owner = msg.sender;
    }  

    struct Vote {          
        uint startAt;                
        bool stopped;        
        address[] candidates;
        address[] participants;
        mapping(address => uint) countOfVotes;
        mapping(address => bool) voteds;
    }

     function createVote(address[] memory _candidates) external {
         votes[countVotes].startAt = block.timestamp;
         votes[countVotes].stopped = false;
         votes[countVotes].candidates = _candidates;
         countVotes++;
     }

     function vote(uint _idOfVote, address _addressCandidate) external payable {
        Vote storage cVote = votes[_idOfVote];
        require(!cVote.stopped, "stopped!");
        require(!cVote.voteds[msg.sender], "you have already voted");
        require(msg.value >= ENTRANCEFEE, "not enough funds");
        uint refund = msg.value - ENTRANCEFEE;
        if(refund > 0) {
            payable(msg.sender).transfer(refund);
        }
        cVote.countOfVotes[_addressCandidate]++;
        cVote.candidates.push(msg.sender);
        cVote.voteds[msg.sender] = true;
     }

    function stopVote(uint _idOfVote) public {
        if(votes[_idOfVote].startAt - DURATION <= 0) {
            votes[_idOfVote].stopped = true;

        address payable winner = payable(win(_idOfVote));
        winner.transfer(address(this).balance - ((address(this).balance * FEE) / 100));
        }      
    }

    function win(uint _idOfVote) public view returns(address) {
        Vote storage cVote = votes[_idOfVote];
        uint maxVote;
        address winner;
        for(uint i = 0; i < cVote.candidates.length; i++) {            
           if(cVote.countOfVotes[cVote.candidates[i]] > maxVote) {
               winner = cVote.candidates[i];
               maxVote = cVote.countOfVotes[cVote.candidates[i]];
           }            
        }
        return winner;
    }

    function participants(uint _idOfVote) public view returns(address[] memory) {
        return votes[_idOfVote].participants;
    }

    function withdrawFEE(uint _idOfVote) public {
        require(!votes[_idOfVote].stopped, "it's not time to stop yet!");
        address payable _to = payable(owner);
        address _thisContract = address(this);
        _to.transfer(_thisContract.balance);
    }
}
//["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2"]
