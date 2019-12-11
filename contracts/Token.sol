pragma solidity ^0.5.3;

// ----------------------------------------------------------------------------
// 'CRYPTOBUCKS' Token Contract
//
// Deployed To : 0x4d9ee34b7ee0d3cef04e5909c27a266e7eb14712
// Symbol      : X-Symbol
// Name        : X-Token
// Total Supply: 1,000,000,000 X-TOKEN
// Decimals    : 2
//
// (c) By 'ANONYMOUS' With 'A2' Symbol 2019.
//
// ----------------------------------------------------------------------------

// Interfaces
import { IERC20Token } from "./iERC20Token.sol";
// Libraries
import { SafeMath } from "./SafeMath.sol";
import { Whitelist } from "./Whitelist.sol";
// Inherited Contracts
import { Pausable } from "./Pausable.sol";
import { Address } from "./Address.sol";

contract Token is IERC20Token, Whitelist, Pausable {
  using SafeMath for uint256;
  using Address for address;

  string _name;
  string _symbol;
  uint256 _totalSupply;
  uint256 _decimals;
  uint256 _totalBurned;

  constructor () public {
    _name = "AXE Coin";
    _symbol = "a2";
    _totalSupply = 100000000000;
    _decimals = 2;
    _totalBurned = 0;
  }

  mapping(address => uint256) private balances;
  mapping(address => mapping(address => uint256)) private allowed;
  
  mapping(address => bool) private allowedBurners;
  mapping(address => uint256) private withdrawals;

  event Burned(address indexed owner, uint256 amount, uint256 timestamp);
  event AuthorizedBurner(address indexed appointer, address indexed burner, uint256 timestamp);

  function name() external view returns (string memory) {
    return _name;
  }

  function symbol() external view returns (string memory) {
    return _symbol;
  }

  function totalSupply() external view returns (uint256) {
    return _totalSupply;
  }

  function decimals() external view returns (uint256) {
    return _decimals;
  }

  function balanceOf(address _account) external view returns (uint256) {
    return balances[_account];
  }

  function allowance(address _owner, address _spender) external view returns (uint256) {
    return allowed[_owner][_spender];
  }

  function transfer(
    address _recipient,
    uint256 _amount
    ) external whenNotPaused onlyWhitelisted(msg.sender, _recipient)
    validAddress(_recipient) sufficientBalance(msg.sender, _amount) returns (bool) {
      balances[msg.sender] = balances[msg.sender].sub(_amount);
      balances[_recipient] = balances[_recipient].add(_amount);
      emit Transfer(msg.sender, _recipient, _amount);
  }

  function approve(
    address _spender,
    uint256 _amount
    ) external whenNotPaused validAddress(_spender)
    sufficientBalance(msg.sender, _amount) returns (bool) {
    allowed[msg.sender][_spender] = allowed[msg.sender][_spender].add(_amount);
    emit Approval(msg.sender, _spender, _amount);
  }

  function transferFrom(
    address _sender,
    address _recipient,
    uint256 _amount
    ) external whenNotPaused validAddress(_recipient)
    sufficientBalance(msg.sender, _amount) returns (bool) {
      require(allowed[_sender][msg.sender] >= _amount, "Above spender allowance.");
      allowed[_sender][msg.sender] = allowed[_sender][msg.sender].sub(_amount);
      balances[_recipient] = balances[_recipient].add(_amount);
      emit Transfer(_sender, _recipient, _amount);
    }

  modifier validAddress(address _address) {
    require(_address != address(0), "Cannot send to address 0x0.");
    _;
  }

  modifier sufficientBalance(address _sender, uint256 _amount) {
    require(balances[_sender] >= _amount, "Insufficient Funds.");
    _;
  }

  // BURN FUNCTIONALITIES

  function totalBurned() external view returns (uint256) {
    return _totalBurned;
  }

  function withdrawalOf(address _account) external view returns (uint256) {
    return withdrawals[_account];
  }

  function authorizeBurner(
    address _burner) external onlyOwner whenNotPaused returns (bool) {
      require(allowedBurners[_burner] == false);
      allowedBurners[_burner] = true;
      emit AuthorizedBurner(msg.sender, _burner, now);
    }

  function burn(
    uint256 _amount) external whenNotPaused isBurner(msg.sender)
    sufficientBalance(msg.sender, _amount) returns (bool) {
      balances[msg.sender] = balances[msg.sender].sub(_amount);
      withdrawals[msg.sender] = withdrawals[msg.sender].add(_amount);
      _totalSupply = _totalSupply.sub(_amount);
      emit Burned(msg.sender, _amount, now);
  }

  modifier isBurner(address _address) {
    require(allowedBurners[_address] == true);
    _;
  }
}