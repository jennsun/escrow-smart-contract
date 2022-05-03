// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

contract Escrow is ReentrancyGuard {
    using SafeERC20 for ERC20;

    /* VARIABLES */

    // tracks whether user has already successfully withdrawn
    mapping(address => bool) public hasWithdrawn;

    // number of taskers who withdraw money
    uint32 public withdrawerCount;
    // total amount of money for task
    uint256 public taskPriceTotal;
    // number of tasks to be completed
    uint256 public numberOfTasks;
    // price per task
    uint256 public pricePerTask;
    // requester
    address public requester;
    // payment token
    ERC20 public paymentToken;
    // this contract's address
    address public thisContractAddress;

    /* EVENTS */
    event DidFund(address indexed sender, uint256 amount);
    event DidWithdraw(address indexed sender, uint256 amount);

    /* MODIFIERS */
    modifier onlyRequester() {
        require(
            msg.sender == requester,
            "Only requester can call this function"
        );
        _;
    }

    constructor(
        ERC20 _paymentToken,
        uint256 _numberOfTasks,
        address _requester
    ) payable {

        // funder cannot be 0
        require(_requester != address(0), "0x0 funder");
        // sale token cannot be 0
        require(address(_paymentToken) != address(0), "0x0 saleToken");
        // start timestamp must be in future
        numberOfTasks = _numberOfTasks;
        requester = _requester;
        paymentToken = _paymentToken;
    }

    function setAddress(address _thisContractAddress) public payable {
        thisContractAddress = _thisContractAddress;
    }

    // Function to allocate funds to the task from Requester
    function fund(uint256 amount) external onlyRequester {

        // transfer funding to this contract
        paymentToken.safeTransferFrom(msg.sender, address(this), amount);

        // increase task amount
        taskPriceTotal += amount;
        pricePerTask = taskPriceTotal / numberOfTasks;

        // emit
        emit DidFund(msg.sender, amount);
    }

    // Function to withdraw task money after task completed
    function withdraw() external nonReentrant {
        require(hasWithdrawn[msg.sender] == false, "already withdrawn");

        // set withdrawn to true
        hasWithdrawn[msg.sender] = true;

        // increment withdrawer count (used as metadata for frontend)
        withdrawerCount += 1;

        // transfer owed sale token to buyer
        // option 1
        paymentToken.safeTransfer(msg.sender, pricePerTask);
        // option 2
        // require(pricePerTask <= address(this).balance, "Trying to withdraw more than contract has");
        // (bool success, ) = (msg.sender).call{value: pricePerTask}(""); // native matic
        // require(success, "Failed to transfer money from contract");

        // emit
        emit DidWithdraw(msg.sender, pricePerTask);
    }

    function greet() public pure returns (string memory) {
        return "Hello, world!";
    }
}
