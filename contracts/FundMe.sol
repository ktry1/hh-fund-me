// SPDX-Licence-Identifier: MIT
pragma solidity ^0.8.7;

// 576.825 gas cost

import "./PriceConverter.sol";

error FundMe__NotOwner();
error FundMe__NotEnoughMoney();
error FundMe__WithdrawalFailed();

/// @title A contract for public funding
/// @author Kyrylo Troiak
/// @notice Basic contract for crowd funding
/// @dev All function calls are currently implemented without side effects
/// @custom:experimental This is an experimental contract.
contract FundMe {
    using StateConverter for uint256;
    uint256 constant MIN_USD = 50 * 1e18;
    address[] private s_funders;
    mapping(address => uint256) public s_addressToAmountFunded;
    address private immutable i_OWNER;

    AggregatorV3Interface public s_priceFeed;

    modifier OnlyOwner() {
        if (msg.sender != i_OWNER) {
            revert FundMe__NotOwner();
        }
        _;
    }

    constructor(address s_priceFeedAddress) {
        i_OWNER = msg.sender;
        s_priceFeed = AggregatorV3Interface(s_priceFeedAddress);
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    function fund() public payable {
        if (!(msg.value.getConversionRate(s_priceFeed) >= MIN_USD)) {
            revert FundMe__NotEnoughMoney();
        }
        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;
        // Get ETH => USD conversion rate
    }

    function withdraw() public OnlyOwner {
        // Resetting mapping
        for (
            uint256 funderIndex = 1;
            funderIndex < s_funders.length;
            funderIndex++
        ) {
            s_addressToAmountFunded[s_funders[funderIndex]] = 0;
        }
        // Resetting Array
        s_funders = new address[](0);
        // Withdrawing funds

        // call
        (bool SendSuccess, bytes memory DataReturned) = payable(msg.sender)
            .call{value: address(this).balance}("");
        if (!SendSuccess) {
            revert FundMe__WithdrawalFailed();
        }
    }

    function cheaperWithdraw() public OnlyOwner {
        address[] memory funders = s_funders;
        for (
            uint256 funderIndex = 1;
            funderIndex < funders.length;
            funderIndex++
        ) {
            s_addressToAmountFunded[funders[funderIndex]] = 0;
        }
        // Resetting Array
        funders = new address[](0);
        s_funders = funders;
        // Withdrawing funds

        // call
        (bool SendSuccess, ) = i_OWNER.call{value: address(this).balance}("");
        if (!SendSuccess) {
            revert FundMe__WithdrawalFailed();
        }
    }

    function getOwner() public view returns (address) {
        return i_OWNER;
    }

    function getFunder(uint256 index) public view returns (address) {
        return s_funders[index];
    }

    function getAddressToAmountFunded(address funder)
        public
        view
        returns (uint256)
    {
        return s_addressToAmountFunded[funder];
    }
}
