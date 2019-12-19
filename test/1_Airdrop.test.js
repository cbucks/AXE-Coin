const AirdropContract = artifacts.require('Airdrop');
const TokenContract = artifacts.require('Token');
const {
    TOKEN_ADDRESS,
    AIRDROP_AMOUNT,
    TOTAL_AIRDROPS,
    AIRDROP_FUNDS,
    NEW_AIRDROP_ADDRESS,
    NEW_AIRDROP_AMOUNT,
    NEW_AIRDROP_OWNER,
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

    it('receives tokens', async () => {
        const airdrop = await AirdropContract.deployed();
        const token = await airdrop.token.call();
        const tokenContract = await TokenContract.at(token);
        await tokenContract.transfer(airdrop.address, AIRDROP_FUNDS);
    });

    it('retrieves remaining tokens in the airdrop contract', async () => {
        const airdrop = await AirdropContract.deployed();
        const remainingTokens = await airdrop.remainingTokens.call();
        assert.equal(remainingTokens.toNumber(), AIRDROP_FUNDS);
    });

    it('verifies balances after owner gives airdrop to an address', async () => {
        const airdrop = await AirdropContract.deployed();
        const token = await airdrop.token.call();
        const tokenContract = await TokenContract.at(token);
        const burnRate = await tokenContract.burnRate.call();
        const amount = await airdrop.amount.call();
        const oldRemainingTokens = await airdrop.remainingTokens.call();
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

    it('verifies that an airdrop transaction triggers a GivenAirdrop event', async () => {
        const airdrop = await AirdropContract.deployed();
        const tx = await airdrop.airdrop(accounts[7]);
        assert.equal(tx.logs[0].args.to, accounts[7]);
        assert.equal(tx.logs[0].event, 'GivenAirdrop');
    });

    it('verifies owner can change token contract address', async () => {
        const airdrop = await AirdropContract.deployed();
        await airdrop.changeTokenAddress(NEW_AIRDROP_ADDRESS);
        const token = await airdrop.token.call();
        assert.equal(token, NEW_AIRDROP_ADDRESS);
    });

    it('verifies owner can change given airdrop amount', async () => {
        const airdrop = await AirdropContract.deployed();
        await airdrop.changeAmount(NEW_AIRDROP_AMOUNT);
        const amount = await airdrop.amount.call();
        assert.equal(amount, NEW_AIRDROP_AMOUNT);
    });

    it('verifies owner can transfer ownership to different account', async () => {
        const airdrop = await AirdropContract.deployed();
        await airdrop.changeOwner(NEW_AIRDROP_OWNER);
        const owner = await airdrop.owner.call();
        assert.equal(owner, NEW_AIRDROP_OWNER);
    });

    it('verifies owner can withdraw all tokens in the airdrop contract', async () => {

    });

    it('throws when attempting to change token contract address if sender is not owner', async () => {
        const airdrop = await AirdropContract.deployed();
        try {
            await airdrop.changeTokenAddress(NEW_AIRDROP_ADDRESS);
            assert.fail();
        } catch (ContractError) {
            return ensureException(ContractError, 'Only owner can perform transaction.');
        }
    });

    it('throws when attempting to change given airdrop amount if sender is not owner', async () => {
        const airdrop = await AirdropContract.deployed();
        try {
            await airdrop.changeAmount(NEW_AIRDROP_AMOUNT);
            assert.fail();
        } catch (ContractError) {
            return ensureException(ContractError, 'Only owner can perform transaction.');
        }
    });

    it('throws when attempting to withdraw all tokens if sender is not owner', async () => {

    });


});