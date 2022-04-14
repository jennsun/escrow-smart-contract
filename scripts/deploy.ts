// // We require the Hardhat Runtime Environment explicitly here. This is optional
// // but useful for running the script in a standalone fashion through `node <script>`.
// //
// // When running the script with `npx hardhat run <script>` you'll find the Hardhat
// // Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

// export const getBlockTime = async (): Promise<number> => {
//   // current block number
//   const currBlockNum = await ethers.provider.getBlockNumber();

//   // current timestamp at block
//   const currTime = (await ethers.provider.getBlock(currBlockNum)).timestamp;

//   return currTime;
// };

// async function main() {
//   // Hardhat always runs the compile task when running scripts with its command
//   // line interface.
//   //
//   // If this script is run directly using `node` you may want to call compile
//   // manually to make sure everything is compiled
//   // await hre.run('compile');
//   let PaymentToken: any;
//   let owner: SignerWithAddress;
//   let requester: SignerWithAddress;
//   let startTime: number; // start timestamp of sale (inclusive)
//   let endTime: number; // end timestamp of sale (inclusive)
//   const numberOfTasks = 10;
//   owner = (await ethers.getSigners())[0];
//   requester = (await ethers.getSigners())[1];
//   const currTime = await getBlockTime();
//   startTime = currTime + 10000;
//   endTime = currTime + 20000;

//   // deploy test tokens - create token w/ initial supply
//   const GenericTokenFactory = await ethers.getContractFactory("GenericToken");
//   PaymentToken = await GenericTokenFactory.connect(requester).deploy(
//     "Test Payment Token",
//     "ETH",
//     "21000000000000000000000000" // 21 million * 10**18
//   );

//   // We get the contract to deploy
//   console.log("a");
//   const escrowContractFactory = await ethers.getContractFactory("Escrow");
//   console.log("f");
//   // const escrowContract = await escrowContractFactory.deploy();
//   const escrowContract = await escrowContractFactory.deploy(
//     PaymentToken.address,
//     numberOfTasks,
//     requester.address,
//     startTime,
//     endTime
//   );
//   console.log("c");
//   await escrowContract.deployed();
//   console.log("d");
//   console.log(
//     "Contracted deployed to: ",
//     (escrowContract as unknown as any).address
//   );
//   console.log("e");

//   // const Greeter = await ethers.getContractFactory("Greeter");
//   // const greeter = await Greeter.deploy("Hello, Hardhat!");

//   // await greeter.deployed();

//   // console.log("Greeter deployed to:", greeter.address);
// }

// // We recommend this pattern to be able to use async/await everywhere
// // and properly handle errors.
// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });

const main = async () => {
  const escrowContractFactory = await ethers.getContractFactory("Escrow");
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
