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
  const result = await escrowFactory
    .connect((await ethers.getSigners())[0])
    .createNewEscrow(
      "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
      10,
      "0x18f82D00D407e08b704F4Eb900D4F5128c44A3f7"
    );

  console.log("result.wait(): ");
  await result.wait();
  const length = await (
    await escrowFactory.connect((await ethers.getSigners())[0])
  ).escrowArrayLength();
  console.log("most recent address");
  console.log(
    await escrowFactory
      .connect((await ethers.getSigners())[0])
      .escrowArray(length - 1)
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
