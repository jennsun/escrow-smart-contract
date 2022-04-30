// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import hre from "hardhat";
const main = async () => {
  const escrowContractFactory = await hre.ethers.getContractFactory(
    "EscrowFactory"
  );
  const escrowContract = await escrowContractFactory.deploy();
  await escrowContract.deployed();
  console.log(
    "Contract deployed to: ",
    (escrowContract as unknown as any).address
  );
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
};

runMain();
