const TokenContract = artifacts.require('Token');
const {
    TOKEN_NAME,
    TOKEN_SYMBOL,
    TOTAL_SUPPLY,
    TOTAL_SUPPLY_MINUS_DECIMAL,
    DECIMALS,
    BURN_RATE,
    TOTAL_BURNED,
    TRANSFER_AMOUNT,
} = require('../constants');

contract('TokenContract', (accounts) => {
    it('should deploy smart contract to ethereum network', async () => {
        const tokenContract = await TokenContract.deployed();
        assert(tokenContract.address !== '');
    });

    it(`should have token name of ${TOKEN_NAME}`, async () => {
        const tokenContract = await TokenContract.deployed();
        const name = await tokenContract.name.call();
        assert.equal(name, TOKEN_NAME);
    });

    it(`should have token symbol of ${TOKEN_SYMBOL}`, async () => {
        const tokenContract = await TokenContract.deployed();
        const symbol = await tokenContract.symbol.call();
        assert.equal(symbol, TOKEN_SYMBOL);
    });

    it(`should have total supply of ${TOTAL_SUPPLY}`, async () => {
        const tokenContract = await TokenContract.deployed();
        const totalSupply = await tokenContract.totalSupply.call();
        assert.equal(totalSupply, TOTAL_SUPPLY);
    });

    it(`should have decimals of ${DECIMALS}`, async () => {
        const tokenContract = await TokenContract.deployed();
        const decimals = await tokenContract.decimals.call();
        assert.equal(decimals, DECIMALS);
    });
    
    it(`should have burn rate of ${BURN_RATE}`, async () => {
        const tokenContract = await TokenContract.deployed();
        const burnRate = await tokenContract.burnRate.call();
        assert.equal(burnRate, BURN_RATE);
    });

    it(`should have total burn of ${TOTAL_BURNED}`, async () => {
        const tokenContract = await TokenContract.deployed();
        const totalBurn = await tokenContract.totalBurned.call();
        assert.equal(totalBurn, TOTAL_BURNED);
    });

    it('verifies balances after a transfer transaction', async () => {
        const tokenContract = await TokenContract.deployed();
        let balance = await tokenContract.balanceOf.call(accounts[0]);
        const burnRate = await tokenContract.burnRate.call();
        assert.equal(balance, TOTAL_SUPPLY);
        await tokenContract.transfer(accounts[1], TRANSFER_AMOUNT);
        balance = await tokenContract.balanceOf.call(accounts[0]);
        const totalDifference = TOTAL_SUPPLY - TRANSFER_AMOUNT - burnRate.toNumber();
        assert.equal(balance.toNumber(), totalDifference);
        balance = await tokenContract.balanceOf.call(accounts[1]);
        assert.equal(balance, TRANSFER_AMOUNT);
    });
});