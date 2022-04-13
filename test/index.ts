import "@nomiclabs/hardhat-ethers";
import { expect } from "chai";
import { ethers, network } from "hardhat";
// import { getBlockTime, getGasUsed, mineNext, mineTimeDelta } from './helpers'
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { Contract } from "@ethersproject/contracts";
import { BigNumber } from "ethers";

export const getBlockTime = async (): Promise<number> => {
  // current block number
  const currBlockNum = await ethers.provider.getBlockNumber();

  // current timestamp at block
  const currTime = (await ethers.provider.getBlock(currBlockNum)).timestamp;

  return currTime;
};

export const mineTimeDelta = async (seconds: number): Promise<void> => {
  await network.provider.send('evm_increaseTime', [seconds])
  await network.provider.send('evm_mine')
}

// describe("Greeter", function () {
//   it("Should return the new greeting once it's changed", async function () {
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, world!");
//     await greeter.deployed();

//     expect(await greeter.greet()).to.equal("Hello, world!");

//     const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

//     // wait until the transaction is mined
//     await setGreetingTx.wait();

//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
// });

// it("Should allow requester to deposit 10ETH", async function () {
//   // const Greeter = await ethers.getContractFactory("Escrow");
//   // // constructor parameters
//   // const greeter = await Greeter.deploy();
//   // await greeter.deployed();

//   // expect(await greeter.greet()).to.equal("Hello, world!");

//   // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

//   // wait until the transaction is mined
//   // await setGreetingTx.wait();

//   // expect(await greeter.greet()).to.equal("Hola, mundo!");
// });

describe("Escrow", function () {
  // unset timeout from the test
  this.timeout(0);

  // deployer address
  let owner: SignerWithAddress;
  let requester: SignerWithAddress;
  let tasker: SignerWithAddress;
  let tasker2: SignerWithAddress;

  // contract vars
  let Escrow: Contract;
  let PaymentToken: any;

  let snapshotBlock: number; // block at which to take allocation snapshot
  let startTime: number; // start timestamp of sale (inclusive)
  let endTime: number; // end timestamp of sale (inclusive)
  const totalTaskPrice = "10000000000000000000"; // 10 PAY per SALE

  // setup for each test
  beforeEach(async () => {
    const currBlock = await ethers.provider.getBlockNumber();
    const currTime = await getBlockTime();
    snapshotBlock = currBlock + 90;
    startTime = currTime + 10000;
    endTime = currTime + 20000;

    // get test accounts
    owner = (await ethers.getSigners())[0];
    requester = (await ethers.getSigners())[1];
    tasker = (await ethers.getSigners())[2];
    tasker2 = (await ethers.getSigners())[3];

    // deploy test tokens - create token w/ initial supply
    const GenericTokenFactory = await ethers.getContractFactory("GenericToken");
    PaymentToken = await GenericTokenFactory.connect(requester).deploy(
      "Test Payment Token",
      "ETH",
      "21000000000000000000000000" // 21 million * 10**18
    );
  });

  it("Should allow requester to fund 10ETH and taskers withdraw 1ETH", async function () {
    const numberOfTasks = 10;
    // deploy Escrow
    const Escrow = await ethers.getContractFactory("Escrow");

    // constructor parameters (paymentAmount)
    const escrow = await Escrow.deploy(
      PaymentToken.address,
      numberOfTasks,
      requester.address,
      startTime,
      endTime
    );

    // requester funds 10 ETH
    await PaymentToken.connect(requester).approve(
      (escrow as unknown as any).address,
      totalTaskPrice
    );

    await escrow.connect(requester).fund(totalTaskPrice);
    expect(await escrow.pricePerTask()).to.equal(
      BigNumber.from(totalTaskPrice).div(numberOfTasks)
    );

    // fast forward from current time to after end time
    mineTimeDelta(endTime - (await getBlockTime()))

    // tasker withdraws 1 ETH
    await escrow.connect(tasker).withdraw();
    expect(await PaymentToken.balanceOf(tasker.address)).to.equal(
      BigNumber.from(totalTaskPrice).div(numberOfTasks)
    );
    expect(await escrow.hasWithdrawn(tasker.address)).to.equal(true);

    // tasker2 withdraws 1 ETH
    await escrow.connect(tasker2).withdraw();
    expect(await PaymentToken.balanceOf(tasker2.address)).to.equal(
      BigNumber.from(totalTaskPrice).div(numberOfTasks)
    );
    expect(await escrow.hasWithdrawn(tasker2.address)).to.equal(true);
  });
  // it("Should allow tasker to withdraw 1 ETH", async function () {
  // };
  // it("Should allow tasker2 to withdraw 1 ETH", async function () {
  // };
});
