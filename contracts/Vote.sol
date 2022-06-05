// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address public owner;
    uint constant FEE = 10; // %
    uint constant ENTRANCEFEE = 10000000000000000;
    uint constant DURATION = 3 days;
    uint countVotes;
    mapping(uint => Vote) votes;

    constructor() {
        owner = msg.sender;
    }  

      modifier onlyOwner {
        require(msg.sender == owner, "only owner");
        _;
    }

    struct Vote {          
        uint startAt;                
        bool stopped;        
        address[] candidates;
        address[] participants;
        mapping(address => uint) countOfVotes;
        mapping(address => bool) voteds;
    }

     function createVote(address[] memory _candidates) onlyOwner external {
         votes[countVotes].startAt = block.timestamp;
         votes[countVotes].stopped = false;
         votes[countVotes].candidates = _candidates;
         countVotes++;
     }

     function vote(uint _idOfVote, address _addressCandidate) external payable {
        Vote storage cVote = votes[_idOfVote];
        require(!cVote.stopped, "voting is over");
        require(!cVote.voteds[msg.sender], "you have already voted");
        require(msg.value >= ENTRANCEFEE, "not enough funds");
        
        uint refund = msg.value - ENTRANCEFEE;
            if(refund > 0) {
                payable(msg.sender).transfer(refund);
            }
        cVote.countOfVotes[_addressCandidate]++;
        cVote.participants.push(msg.sender);
        cVote.voteds[msg.sender] = true;
     }

    function stopVote(uint _idOfVote) public {
        require((block.timestamp > votes[_idOfVote].startAt + DURATION), "it's not time to stop voting yet!");
            
        votes[_idOfVote].stopped = true;
        address payable winner = payable(win(_idOfVote));
        winner.transfer(address(this).balance - ((address(this).balance * FEE) / 100));
        
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

    function getCountsOfcandidatsVotes(uint _idOfVote, address _addressCandidat) public view returns(uint) {
        return votes[_idOfVote].countOfVotes[_addressCandidat];
    }


    function participants(uint _idOfVote) public view returns(address[] memory) {
        return votes[_idOfVote].participants;
    }

    function withdrawFEE(uint _idOfVote) onlyOwner public {
        require(votes[_idOfVote].stopped, "voting is not over yet");
        address payable _to = payable(owner);
        address _thisContract = address(this);
            _to.transfer(_thisContract.balance);
    }
    
    function getContractBalance() public view returns(uint) {
        return address(this).balance;
    }

    function getCountVotes() public view returns(uint) {
        return countVotes;
    }
}