const AirdropContract = artifacts.require('Airdrop');
const {
    TOKEN_ADDRESS,
    AIRDROP_AMOUNT,
    TOTAL_AIRDROPS,
} = require('../constants/');
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


});