const { Contract } = require('ethers');
const { yubiaiArbitrable } = require('./abis/abis');

class YubiaiPaymentArbitrable {
  constructor(account) {
    this.account = account;
    this.contractAddress = process.env.SMART_CONTRACT_ARBITRABLE_ADDRESS;
  }

  async initContract() {
    this.contract = new Contract(this.contractAddress, yubiaiArbitrable, this.account);
  }

  async payDeal(dealId) {
    const tx = await this.contract.functions.closeDeal(dealId);
    console.debug("Transaction: \n", tx);
  }

}

module.exports = YubiaiPaymentArbitrable;