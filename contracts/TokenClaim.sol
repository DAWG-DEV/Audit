// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
contract TokenClaim is Ownable, ReentrancyGuard{
    IERC20 public tokenAddress;

    mapping(address => uint256) public whitelist;
    bool public paused;

    event Whitelisted(address indexed account, uint256 amount);
    event RemovedFromWhitelist(address indexed account, uint256 amount);
    event Claimed(address indexed account, uint256 amount);
    event Paused();
    event Unpaused();
    event UpdatedAmount(address indexed account,uint256 previousAmount, uint256 newAmount);

    error ArrayLengthMismatch();
    error InPausing();
    error AddToWhiteList_TransferFailed(uint256 amount);
    error RemoveFromWhiteList_TransferFailed(uint256 amount);
    error Claim_NoToken();
    error Claim_TransferFailed(uint256 amount);
    error Update_TransferToOwnerFailed(uint256 amount);
    error Update_TransferFromOwnerFailed(uint256 amount);

    constructor(address _tokenAddress, address owner) Ownable(owner){
        paused = false;
        tokenAddress = IERC20(_tokenAddress);
    }

    modifier whenNotPaused() {
        if(paused){
            revert InPausing();
        }
        _;
    }

    function addToWhitelist(address[] calldata accounts, uint256[] calldata amounts) external onlyOwner {
        if( accounts.length != amounts.length) {
            revert ArrayLengthMismatch();
        }
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < accounts.length; i++) {
            whitelist[accounts[i]] += amounts[i]; 
            totalAmount += amounts[i];
            emit Whitelisted(accounts[i], amounts[i]);
        }
        bool success = tokenAddress.transferFrom(msg.sender, address(this), totalAmount);
        if(!success) {
            revert AddToWhiteList_TransferFailed(totalAmount);
        }
    }

    function removeFromWhitelist(address account) external onlyOwner {
        uint256 amount = whitelist[account];
        if(amount > 0) {
            bool success = tokenAddress.transfer(msg.sender, amount);
            if (!success) {
                revert RemoveFromWhiteList_TransferFailed(amount);
            }
        }

        delete whitelist[account];
        emit RemovedFromWhitelist(account, amount);
    }

    function claim() external whenNotPaused nonReentrant {
        uint256 amount = whitelist[msg.sender];
        if(amount == 0){
            revert Claim_NoToken();
        }
        whitelist[msg.sender] = 0;
        bool success = tokenAddress.transfer(msg.sender, amount);  
        if(!success) {
            revert Claim_TransferFailed(amount);
        }
        emit Claimed(msg.sender, amount);
    }

    function updateAmount(address account, uint256 newAmount) external onlyOwner {
        uint256 previousAmount = whitelist[account];
        if(previousAmount == newAmount) {
            return;
        }
        if (previousAmount > newAmount) {
            if(!tokenAddress.transfer(msg.sender, previousAmount - newAmount)){
                revert Update_TransferToOwnerFailed(previousAmount - newAmount);
            }
        } else {
            // previous amount < new amount
            if(!tokenAddress.transferFrom(msg.sender, address(this), newAmount - previousAmount)){
                revert Update_TransferFromOwnerFailed(newAmount - previousAmount);
            }
        }
        whitelist[account] = newAmount;
        emit UpdatedAmount(account, previousAmount, newAmount);
    }

    function pause() external onlyOwner {
        paused = true;
        emit Paused();
    }

    function unpause() external onlyOwner {
        paused = false;
        emit Unpaused();
    }
}