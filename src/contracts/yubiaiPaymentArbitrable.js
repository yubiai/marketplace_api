const Web3 = require('web3');
const { yubiaiArbitrable } = require('./abis/abis');

class YubiaiPaymentArbitrable {
  constructor() {
    this.privateKey = process.env.PRIVATE_KEY;
    this.contractAddress = process.env.SMART_CONTRACT_ARBITRABLE_ADDRESS;;
    this.web3 = new Web3(process.env.NEXT_PUBLIC_INFURA_ENDPOINT_GOERLI ||
      new Web3.providers.HttpProvider('http://localhost:8545'));
  }

  async initContract() {
    this.contract = new this.web3.eth.Contract(yubiaiArbitrable, this.contractAddress);
  }

  // call closeDeal method using web3.js
  async payDeal(dealId) {

    const functionSignature = this.contract.methods.closeDeal(dealId).encodeABI();
    const account = this.web3.eth.accounts.privateKeyToAccount(this.privateKey);

    const functionCall = {
      from: account.address,
      to: this.contractAddress,
      data: functionSignature,
      gas: 3000000
    };

    this.web3.eth.accounts.signTransaction(functionCall, this.privateKey, (error, signedTx) => {
      if (error) {
        console.error(error);
        return;
      }
      this.web3.eth.sendSignedTransaction(signedTx.rawTransaction, (error, transactionHash) => {
        if (error) {
          console.error(error);
          return;
        }
        console.log(transactionHash);
      });
    });
  }

}

module.exports = YubiaiPaymentArbitrable;