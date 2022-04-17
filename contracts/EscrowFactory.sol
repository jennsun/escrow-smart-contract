// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Escrow.sol";

contract EscrowFactory {
    event CreatedNewEscrow(Escrow indexed newEscrow);

    Escrow[] public escrowArray;
    uint256 public escrowArrayLength;

    function createNewEscrow(
        ERC20 _paymentToken,
        uint256 _numberOfTasks,
        address _requester
    ) public {
        Escrow escrow = new Escrow(
            _paymentToken,
            _numberOfTasks,
            _requester
            // _startTime,
            // _endTime
        );
        escrowArray.push(escrow);
        escrowArrayLength++;
        emit CreatedNewEscrow(escrow);
    }

    // function getEscrowArrayLength() public returns (uint256) {
    //     return escrowArrayLength;
    // }
}
