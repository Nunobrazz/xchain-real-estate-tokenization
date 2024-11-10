// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {RealEstateToken} from "../RealEstateToken.sol";
import {IERC1155} from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import {IERC1155Receiver, IERC165} from "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {SafeCast} from "@openzeppelin/contracts/utils/math/SafeCast.sol";

contract DeutchAuction is IERC1155Receiver, ReentrancyGuard {

    error DeutchAuction_OnlySellerOrAutomationCanCall();
    error DeutchAuction_OnlySellerCanCall();
    error DeutchAuction_AuctionAlreadyStarted();
    error DeutchAuction_ToEarlyToDecrementPrice(uint48 timestamp);
    error DeutchAuction_NewPriceHigherThanOldPrice();
    error DeutchAuction_NewPriceLowerThanReservePrice();
    error OnlyRealEstateTokenSupported();
    error DeutchAuction_NoAuctionsInProgress();
    error DeutchAuction_BidNotHighEnough();
    error DeutchAuction_TooEarlyToEnd();
    error FailedToSendEth(address recipient, uint256 amount);
    error AmountHigherThanSupply();
    error AmountToHigh();

    address internal immutable i_seller;
    RealEstateToken internal immutable i_realEstateToken;

    address internal s_automationForwarderAddress;
    bool internal s_started;
    uint256 internal s_availableAmount;
    uint256 internal s_tokenIdOnAuction;
    uint256 internal s_roundPrice; // per unit
    uint256 internal s_automatedDecrementStep;
    uint48 internal s_roundTimestamp;
    uint256 internal s_reservePrice;

    struct BidDetails {
        address bidder;
        uint256 amount;
        uint256 pricePerUnit;
    }

    BidDetails[] internal s_bids;

    event AuctionStarted(uint256 indexed tokenId, uint256 indexed amount, uint256 indexed initiaPrice);
    event Bid(address indexed bidder, uint256 indexed amount, uint256 indexed availableAmount);
    event AuctionEnded(uint256 indexed tokenId, uint256 stillAvailableAmount, uint256 indexed clearPrice);
    event NewRoundPrice(uint256 indexed amount);
   
    modifier onlySeller(){
        if (msg.sender != i_seller) revert DeutchAuction_OnlySellerCanCall();
        _;
    }

    constructor(address realEstateTokenAddress) {
        i_seller = msg.sender;
        i_realEstateToken = RealEstateToken(realEstateTokenAddress);
    }

    function setAutomationForwarder(address automationForwarderAddress) external onlySeller {
        s_automationForwarderAddress = automationForwarderAddress;
    }    
    
    function startAuction(uint256 tokenId, bytes calldata data, uint256 amount, uint256 initialPrice, uint256 decrementStep, uint256 reservePrice)
        external
        nonReentrant
        onlySeller
    {
        if (s_started) revert DeutchAuction_AuctionAlreadyStarted();
        if (amount > i_realEstateToken.totalSupply(tokenId)){
            revert AmountHigherThanSupply();
        }
        i_realEstateToken.safeTransferFrom(i_seller, address(this), tokenId, amount, data);

        s_started = true;
        s_tokenIdOnAuction = tokenId;
        s_availableAmount = amount;
        s_roundPrice = initialPrice;
        s_automatedDecrementStep = decrementStep;
        s_reservePrice = reservePrice;
        s_roundTimestamp = SafeCast.toUint48(block.timestamp);

        emit AuctionStarted(tokenId, s_availableAmount, reservePrice);
    }

    function getTokenIdOnAuction() external view returns (uint256) {
        return s_tokenIdOnAuction;
    }

    function abortAuction() internal onlySeller {
        if (!s_started) revert DeutchAuction_NoAuctionsInProgress();
        s_started=false;
        delete s_bids;
    }

    function setRoundPrice(uint256 newRoundPrice) external onlySeller{
        if (!s_started) revert DeutchAuction_NoAuctionsInProgress();
        if (newRoundPrice > s_roundPrice) revert DeutchAuction_NewPriceHigherThanOldPrice();
        if (newRoundPrice < s_reservePrice) revert DeutchAuction_NewPriceLowerThanReservePrice();
        /*if (s_roundTimestamp + SafeCast.toUint48(1 days) > SafeCast.toUint48(block.timestamp)){
          revert DeutchAuction_ToEarlyToDecrementPrice(SafeCast.toUint48(block.timestamp));
        }*/

        s_roundPrice = newRoundPrice;
        s_roundTimestamp = SafeCast.toUint48(block.timestamp);

        emit NewRoundPrice(s_roundPrice);
    }

    function updateRoundPrice() external onlySeller {
        if (!s_started) revert DeutchAuction_NoAuctionsInProgress();
        if (msg.sender != i_seller && msg.sender != s_automationForwarderAddress) revert DeutchAuction_OnlySellerOrAutomationCanCall();
        
        if (s_roundTimestamp + SafeCast.toUint48(1 days) > SafeCast.toUint48(block.timestamp)){
          revert DeutchAuction_ToEarlyToDecrementPrice(SafeCast.toUint48(block.timestamp));
        }
            
        if (s_roundPrice - s_automatedDecrementStep < s_reservePrice){
            endAuction();
            return;
        } 
        
        s_roundPrice = s_roundPrice - s_automatedDecrementStep;
        s_roundTimestamp = SafeCast.toUint48(block.timestamp);
    
        emit NewRoundPrice(s_roundPrice);
    }

    function bid(uint256 amount) external payable nonReentrant {
        if (!s_started) revert DeutchAuction_NoAuctionsInProgress();
        if (msg.value < s_roundPrice*amount) revert DeutchAuction_BidNotHighEnough();
        if (amount > s_availableAmount) revert AmountToHigh();

        s_bids.push(BidDetails(msg.sender, amount, msg.value/amount));

        s_availableAmount -= amount;
        if (s_availableAmount == 0){
            endAuction();
        }
        emit Bid(msg.sender, msg.value, s_availableAmount);
    }


    function endAuction() internal nonReentrant {
        if (!s_started) revert DeutchAuction_NoAuctionsInProgress();
        if (s_roundPrice > s_reservePrice) revert DeutchAuction_TooEarlyToEnd();

        s_started = false;

        for (uint256 i=0; i < s_bids.length; ++i){
            i_realEstateToken.safeTransferFrom(
                address(this), s_bids[i].bidder, s_tokenIdOnAuction, s_bids[i].amount, "");
        }

        (bool sent,) = i_seller.call{value: s_roundPrice}("");
        if (!sent) revert FailedToSendEth(i_seller, s_roundPrice);

        emit AuctionEnded(s_tokenIdOnAuction, s_availableAmount, s_roundPrice);
    }

    function onERC1155Received(
        address, /*operator*/
        address, /*from*/
        uint256, /*id*/
        uint256, /*value*/
        bytes calldata /*data*/
    ) external view returns (bytes4) {
        if (msg.sender != address(i_realEstateToken)) {
            revert OnlyRealEstateTokenSupported();
        }
        return IERC1155Receiver.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address, /*operator*/
        address, /*from*/
        uint256[] calldata, /*ids*/
        uint256[] calldata, /*values*/
        bytes calldata /*data*/
    ) external view returns (bytes4) {
        if (msg.sender != address(i_realEstateToken)) {
            revert OnlyRealEstateTokenSupported();
        }

        return IERC1155Receiver.onERC1155BatchReceived.selector;
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(IERC165) returns (bool) {
        return interfaceId == type(IERC1155Receiver).interfaceId || interfaceId == type(IERC165).interfaceId;
    }
}