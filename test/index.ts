import '@nomiclabs/hardhat-ethers'
import { expect } from "chai";
import { ethers } from "hardhat";
import { getBlockTime, getGasUsed, mineNext, mineTimeDelta } from './helpers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { Contract } from '@ethersproject/contracts'

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

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
  this.timeout(0)

  // deployer address
  let requester: SignerWithAddress
  let tasker: SignerWithAddress
  let tasker2: SignerWithAddress
  let Escrow: Contract

  let snapshotBlock: number // block at which to take allocation snapshot
  let startTime: number // start timestamp of sale (inclusive)
  let endTime: number // end timestamp of sale (inclusive)
  const salePrice = '10000000000000000000' // 10 PAY per SALE

  // setup for each test
  beforeEach(async () => {
    mineNext()
    const currBlock = await ethers.provider.getBlockNumber()
    const currTime = await getBlockTime()
    mineNext()
    snapshotBlock = currBlock + 90
    startTime = currTime + 10000
    endTime = currTime + 20000

    // get test accounts
    requester = (await ethers.getSigners())[0]
    tasker = (await ethers.getSigners())[1]
    tasker2 = (await ethers.getSigners())[2]
    
  })

  it("Should allow requester to fund 10ETH", async function () {
    const Escrow = await ethers.getContractFactory("Escrow");
    // constructor parameters
    const escrow = await Escrow.deploy();
    // await greeter.deployed();

    // expect(await greeter.greet()).to.equal("Hello, world!");

    // const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    // await setGreetingTx.wait();

    // expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
  // it("Should allow tasker to withdraw 1 ETH", async function () {
  // };
  // it("Should allow tasker2 to withdraw 1 ETH", async function () {
  // };
  
});
