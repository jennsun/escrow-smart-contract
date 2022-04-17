import { ethers } from "hardhat";

import EscrowFactory from "../artifacts/contracts/EscrowFactory.sol/EscrowFactory.json";

export async function main(): Promise<void> {
  // params
  const escrowFactoryAddress: string =
    "0x18f82D00D407e08b704F4Eb900D4F5128c44A3f7"; // address

  // get allocationSale contract
  const escrowFactory = new ethers.Contract(
    escrowFactoryAddress,
    EscrowFactory.abi
  );
  //   provider.getCode(address);
  //   console.log("Does this work?");
  //   console.log(
  //     await escrowFactory
  //       .connect((await ethers.getSigners())[0])
  //       .createNewEscrow(
  //         "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
  //         10,
  //         "0x18f82D00D407e08b704F4Eb900D4F5128c44A3f7"
  //       )
  //   );
  //   console.log("===============");
  const result = await escrowFactory
    .connect((await ethers.getSigners())[0])
    .createNewEscrow(
      "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
      10,
      "0x18f82D00D407e08b704F4Eb900D4F5128c44A3f7"
      //   1750136782,
      //   1850136782
    );

  console.log("result.wait(): ");
  //   console.log(await (await result.wait()).events[0].getTransactionReceipt());
  await result.wait();
  //   console.log("length:");
  //   console.log("o wait whats this");
  //   console.log(
  //     await (
  //       await escrowFactory.connect((await ethers.getSigners())[0])
  //     ).escrowArrayLength()
  //   );
  //   console.log("then value");
  const length = await (
    await escrowFactory.connect((await ethers.getSigners())[0])
  ).escrowArrayLength();
  console.log(length);
  console.log("most recent address");
  // THE THING INSIDE OF THIS IS THE MOST RECENT ADDRESS, NEWEST CONTRACT
  console.log(
    await escrowFactory
      .connect((await ethers.getSigners())[0])
      .escrowArray(length - 1)
  );
  console.log("=========");
  console.log(result);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
