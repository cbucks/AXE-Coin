const AirdropContract = artifacts.require('Airdrop');
const {
    ensureException,
} = require('./helpers/Utils');

contract('Airdrop', (accounts) => {
    it('should deploy smart contract to ethereum network', async () => {
        const airdrop = await AirdropContract.deployed();
        assert(airdrop.address !== '');
    });
});