const TokenContract = artifacts.require('Token');
const {
    TOKEN_NAME,
    TOKEN_SYMBOL,
    TOTAL_SUPPLY,
    DECIMALS,
    BURN_RATE,
    TOTAL_BURNED,
} = require('../constants');

contract('TokenContract', () => {
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
});