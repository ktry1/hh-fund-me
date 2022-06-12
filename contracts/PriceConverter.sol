// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library StateConverter {
    function getPrice(AggregatorV3Interface priceFeed)
        internal
        view
        returns (uint256)
    {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return uint256(price * 1e10);
    }

    function getConversionRate(
        uint256 ethAmount,
        AggregatorV3Interface priceFeed
    ) internal view returns (uint256) {
        uint256 Ethprice = getPrice(priceFeed);
        uint256 ethAmountInUsd = (Ethprice * ethAmount) / 1e18;
        return ethAmountInUsd;
        // Adrress 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        // ABI
    }
}
