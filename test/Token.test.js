const TokenContract = artifacts.require('Token');
const {
    TOKEN_NAME,
    TOKEN_SYMBOL,
    TOTAL_SUPPLY,
    DECIMALS,
    BURN_RATE,
    TOTAL_BURNED,
    TRANSFER_AMOUNT,
    INVALID_TRANSFER_AMOUNT,
    INVALID_TRANSFER_RECIPIENT,
} = require('../constants');
const {
    ensureException,
} = require('./helpers/Utils');

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

    it('verifies that transfer transaction triggers a Transfer event', async () => {
        const tokenContract = await TokenContract.deployed();
        const tx = await tokenContract.transfer(accounts[1], TRANSFER_AMOUNT);
        assert(tx.logs.length > 0 && tx.logs[1].event == 'Transfer');
        assert.equal(tx.logs[1].args.from, accounts[0]);
        assert.equal(tx.logs[1].args.to, accounts[1]);
        assert.equal(tx.logs[1].args.value, TRANSFER_AMOUNT);
    });

    it('verifies that transfer transaction triggers a Burned event', async () => {
        const tokenContract = await TokenContract.deployed();
        const tx = await tokenContract.transfer(accounts[1], TRANSFER_AMOUNT);
        assert(tx.logs.length > 0 && tx.logs[0].event == 'Burned');
        assert.equal(tx.logs[1].args.from, accounts[0]);
        assert.equal(tx.logs[1].args.value, TRANSFER_AMOUNT);
    });

    it('throws when attempting a transfer more than the balance', async () => {
        const tokenContract = await TokenContract.deployed();
        try {
            await tokenContract.transfer(accounts[1], INVALID_TRANSFER_AMOUNT);
            assert.fail();
        } catch (ContractError) {
            return ensureException(ContractError, 'Insufficient Funds.');
        }
    });

    it('throws when attempting a transfer to an invalid address', async () => {
        const tokenContract = await TokenContract.deployed();
        try {
            await tokenContract.transfer(INVALID_TRANSFER_RECIPIENT, TRANSFER_AMOUNT);
            assert.fail();
        } catch (ContractError) {
            return ensureException(ContractError, 'Cannot send to address 0x0.');
        }
    });

    it('throws when attempting a transfer to yourself', async () => {
        const tokenContract = await TokenContract.deployed();
        try {
            await tokenContract.transfer(accounts[0], TRANSFER_AMOUNT);
        } catch (ContractError) {
            return ensureException(ContractError, 'Cannot send to yourself.');
        }
    });
});