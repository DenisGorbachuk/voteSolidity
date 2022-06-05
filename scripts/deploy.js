const hre = require('hardhat')
const ethers = hre.ethers


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });