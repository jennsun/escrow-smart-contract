// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Escrow is ReentrancyGuard {
    using SafeERC20 for ERC20;

    // VARIABLES
    // number of decimals of sale price
    uint64 constant SALE_PRICE_DECIMALS = 10**18;

    // tracks whether user has already successfully withdrawn
    mapping(address => bool) public hasWithdrawn;

    // number of taskers who withdraw money
    uint32 public withdrawerCount;
    // amount of task funding remaining to give
    uint256 public taskAmount;
    // total amount of money for task
    uint256 public taskPriceTotal;
    // number of tasks to be completed
    uint256 public numberOfTasks;
    // requester
    address public requester;
    // payment token
    // ERC20 public paymentToken;
    // sale token
    ERC20 public saleToken;
    // start timestamp when sale is active (inclusive)
    uint256 public startTime;
    // end timestamp when sale is active (inclusive)
    uint256 public endTime;

    // EVENTS
    event Fund(address indexed sender, uint256 amount);
    event Withdraw(address indexed sender, uint256 amount);

    // MODIFIERS
    modifier onlyRequester() {
        require(msg.sender == requester, "Only requester can call this function");
        _;
    }

    // modifier onlytasker() {
    //     require(msg.sender == tasker, "Only tasker can call this function");
    //     _;
    // }

    // FUNCTIONS
    constructor(
        uint256 _taskPriceTotal,
        uint256 _numberOfTasks,
        address _requester,
        // ERC20 _paymentToken,
        ERC20 _saleToken,
        uint256 _startTime,
        uint256 _endTime
    ) {
        // funder cannot be 0
        require(_requester != address(0), '0x0 funder');
        // sale token cannot be 0
        require(address(_saleToken) != address(0), '0x0 saleToken');
        // start timestamp must be in future
        require(block.timestamp < _startTime, 'start timestamp too early');
        // end timestamp must be after start timestamp
        require(_startTime < _endTime, 'end timestamp before start');
        // price of task cannot be 0
        require(_taskPriceTotal != 0, 'price cannot be 0');
        taskPriceTotal = _taskPriceTotal;
        numberOfTasks = _numberOfTasks;
        requester = _requester;
        paymentToken = _paymentToken;
        saleToken = _saleToken;
        startTime = _startTime;
        endTime = _endTime;
    }

    // Function to allocate funds to the task from Requester
    function fund(uint256 amount) external onlyRequester {
        // make sure task has not started
        require(block.timestamp < startTime, 'sale already started');

        // transfer funding to this contract
        saleToken.safeTransferFrom(msg.sender, address(this), amount);

        // increase task amount
        taskAmount += amount;

        // emit
        emit Fund(msg.sender, amount);
    }

    // Function to withdraw task money after task completed
    function withdraw() external nonReentrant {
        // must be past end timestamp 
        require(endTime < block.timestamp, 'cannot withdraw yet');
        // prevent repeat withdraw
        require(hasWithdrawn[msg.sender] == false, 'already withdrawn');
        // must not be a zero price sale
        require(taskPriceTotal != 0, 'zero price task');

        // calculate amount of sale token owed to tasker
        uint256 saleTokenOwed = (taskPriceTotal * SALE_PRICE_DECIMALS) / numberOfTasks;

        // set withdrawn to true
        hasWithdrawn[msg.sender] = true;

        // increment withdrawer count
        withdrawerCount += 1;

        // transfer owed sale token to buyer
        saleToken.safeTransfer(msg.sender, saleTokenOwed);

        // emit
        emit Withdraw(msg.sender, saleTokenOwed);
    }

    function greet() public pure returns (string memory) {
        return "Hello, world!";
    }
}