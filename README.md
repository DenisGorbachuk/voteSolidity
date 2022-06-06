# Hardhat Project
run script commands: 
  - copmile - npm run re
  - coverage - npm run test
  - deploy - npm run deployRinkeby
  
# Tasks

- npx hardhat createVote --vote-contract-address 0x381b70d5768b0A66703e9Bd5c2C42fd9a18936F3 --network rinkeby --candidates 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC,0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f

- npx hardhat vote --vote-contract-address 0x381b70d5768b0A66703e9Bd5c2C42fd9a18936F3 --network rinkeby --voting-id 0 --candidate 0x70997970c51812dc3a010c7d01b50e0d17dc79c8

- npx hardhat stopVote --vote-contract-address 0x381b70d5768b0A66703e9Bd5c2C42fd9a18936F3 --network rinkeby  --voting-id 0


- npx hardhat withdrawFEE --vote-contract-address 0x381b70d5768b0A66703e9Bd5c2C42fd9a18936F3 --network rinkeby --voting-id 0 --to 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
