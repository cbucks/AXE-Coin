const AirdropContract = artifacts.require('Airdrop');
const TokenContract = artifacts.require('Token');
const {
    TOKEN_ADDRESS,
    AIRDROP_AMOUNT,
    TOTAL_AIRDROPS,
    AIRDROP_FUNDS,
} = require('../constants');
const {
    ensureException,
} = require('./helpers/Utils');

contract('Airdrop', (accounts) => {
    it('should deploy smart contract to ethereum network', async () => {
        const airdrop = await AirdropContract.deployed();
        assert(airdrop.address !== '');
    });

    it(`should have token address of ${TOKEN_ADDRESS}`, async () => {
        const airdrop = await AirdropContract.deployed();
        const token = await airdrop.token.call();
        assert.equal(token, TOKEN_ADDRESS);
    });

    it(`should have airdrop amount of ${AIRDROP_AMOUNT}`, async () => {
        const airdrop = await AirdropContract.deployed();
        const amount = await airdrop.amount.call();
        assert.equal(amount, AIRDROP_AMOUNT);
    });

    it(`should have total airdrop amount of ${TOTAL_AIRDROPS} on deployment`, async () => {
        const airdrop = await AirdropContract.deployed();
        const totalAirdrops = await airdrop.totalAirdrops.call();
        assert.equal(totalAirdrops, TOTAL_AIRDROPS);
    });

    it('owner can change token address', async () => {
        const airdrop = await AirdropContract.deployed();
        await airdrop.changeTokenAddress(process.env.TOKEN_ADDRESS);
        const token = await airdrop.token.call();
        assert.equal(token, process.env.TOKEN_ADDRESS);
    });

    it('receive tokens', async () => {
        const airdrop = await AirdropContract.deployed();
        const token = await airdrop.token.call();
        const tokenContract = await TokenContract.at(token);
        await tokenContract.transfer(airdrop.address, AIRDROP_FUNDS);
    });

    it('retrieve remaining tokens in the airdrop contract', async () => {
        const airdrop = await AirdropContract.deployed();
        const remainingTokens = await airdrop.remainingTokens.call();
        assert.equal(remainingTokens.toNumber(), AIRDROP_FUNDS);
    });

    it('owner can do airdrop to a new recipient', async () => {
        const airdrop = await AirdropContract.deployed();
        const token = await airdrop.token.call();
        const tokenContract = await TokenContract.at(token);
        const burnRate = await tokenContract.burnRate.call();
        const amount = await airdrop.amount.call();
        const oldRemainingTokens = await airdrop.remainingTokens.call();
        const oldBalance = await tokenContract.balanceOf.call(accounts[4]);
        await airdrop.airdrop(accounts[4]);
        const remainingTokens = await airdrop.remainingTokens.call();
        const balance = await tokenContract.balanceOf.call(accounts[4]);
        assert.equal(remainingTokens.toNumber(), oldRemainingTokens.toNumber() - amount.toNumber() - burnRate.toNumber());
        assert.equal(balance.toNumber(), amount.toNumber());
    });

    it('throws when attempting to airdrop an address who already received airdrop before', async () => {
        const airdrop = await AirdropContract.deployed();
        try {
            await airdrop.airdrop(accounts[4]);
            assert.fail();
        } catch (ContractError) {
            return ensureException(ContractError, 'Address has already received an airdrop.');
        }
    });



});