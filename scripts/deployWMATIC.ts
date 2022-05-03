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