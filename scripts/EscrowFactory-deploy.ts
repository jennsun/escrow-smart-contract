import { ethers } from "hardhat";

import EscrowFactory from "../artifacts/contracts/EscrowFactory.sol/EscrowFactory.json";

export async function main(): Promise<void> {
  // params
  const escrowFactoryAddress: string =
    "0xB6B7D8a86863e0D7Ed5ef5C24CB35901fBed7d74"; // address

  // get allocationSale contract
  const escrowFactory = new ethers.Contract(
    escrowFactoryAddress,
    EscrowFactory.abi
  );

  //   console;
  const result = await escrowFactory
    .connect((await ethers.getSigners())[0])
    .createNewEscrow(
      "0x45c87f42c54aa79e91f502bc30ffd805f9ab642f",
      10,
      "0x45c87f42c54aa79e91f502bc30ffd805f9ab642f",
      1750136782,
      1850136782
    );

  console.log("result.wait(): ");
  //   console.log(await (await result.wait()).events[0].getTransactionReceipt());
  await result.wait();
  console.log("length:");
  const length = await escrowFactory
    .connect((await ethers.getSigners())[0])
    .getEscrowArrayLength().value;
  console.log(length);
  console.log("most recent address");
  console.log(
    await escrowFactory.connect((await ethers.getSigners())[0]).escrowArray(0)
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
