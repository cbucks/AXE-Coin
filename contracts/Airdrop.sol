pragma solidity ^0.5.3;

import { Token } from "./Token.sol";
// Libraries
import { SafeMath } from "./SafeMath.sol";
import { Whitelist } from "./Whitelist.sol";
import { Address } from "./Address.sol";
// Inherited Contracts
import { Pausable } from "./Pausable.sol";

contract Airdrop is Pausable, Whitelist {
    using SafeMath for uint256;
    using Address for address;

    address _token;
    uint256 _amount;
    uint256 _totalAirdrops;

    mapping(address => uint256) private airdrops;

    event GivenAirdrop(address indexed to, uint256 value, uint256 timestamp);
    event AmountChanged(address indexed from, uint256 value, uint256 timestamp);
    event TokenChanged(address indexed from, address indexed newAddress, uint256 timestamp);
    event OwnerWithdrawn(address indexed from, uint256 value, uint256 timestamp);

    constructor() public {
        _token = 0x04D37d12f89813c2683e526d2DC2c54c6dbbDDe7;
        _amount = 100;
        _totalAirdrops = 0;
    }

    function remainingTokens() external view returns (uint256) {
        return Token(_token).balanceOf(address(this));
    }

    // Check if what makes more sense, push or pull. Right now is push.
    // Push Model: We send the airdrop to them.
    // Pull Model: They make the transaction and they receive the tokens. Problem: They pay for gas.
    function airdrop(
        address _recipient) external onlyOwner whenNotPaused newRecipient(_recipient)
        onlyWhitelisted(msg.sender, _recipient) returns (bool) {
        require(_amount > 0, "Amount should be greater than zero.");
        require(!_recipient.isContract(), "Recipient cannot be a smart contract."); // Prevent reentrancy attack
        airdrops[_recipient] = _amount;
        _totalAirdrops = _totalAirdrops.add(_amount);
        Token(_token).transfer(_recipient, _amount);
        emit GivenAirdrop(_recipient, _amount, now);
    }

    modifier newRecipient(address _recipient) {
        require(airdrops[_recipient] == 0, "Address has already received an airdrop.");
        _;
    }

    // Owner Functions

    function changeTokenAddress(address _newAddress) external onlyOwner returns (bool) {
        _token = _newAddress;
        emit TokenChanged(msg.sender, _newAddress, now);
    }

    function changeAmount(uint256 _newAmount) external onlyOwner returns (bool) {
        _amount = _newAmount;
        emit AmountChanged(msg.sender, _newAmount, now);
    }

    // Withdraw Functions

    // Owner withdraws all tokens here in the airdrop
    function ownerWithdraw() external onlyOwner returns (bool) {
        uint256 tokenBurnFee = Token(_token).burnRate();
        uint256 airdropBalance = Token(_token).balanceOf(address(this)).sub(tokenBurnFee);
        Token(_token).transfer(msg.sender, airdropBalance);
        emit OwnerWithdrawn(msg.sender, airdropBalance, now);
    }
}