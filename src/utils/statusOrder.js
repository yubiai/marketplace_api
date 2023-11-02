const { request } = require('graphql-request');

// Verify Token Lens
const dealCreatedsInfo = (dealId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = `query MyQuery {
            dealCreateds(where: {dealId: "${dealId}"}) {
              id
              deal_state
              dealId
              transactionHash
              deal_claimCount
              deal_createdAt
              deal_currentClaim
              deal_extraBurnFee
              deal_amount
              deal_buyer
              deal_token
              deal_timeForClaim
              deal_timeForService
            }
          }`
      const apiYubiaiMarketTheGraph = 'https://api.studio.thegraph.com/query/45614/yubiaimarketplace/v0.0.1';

      await request(apiYubiaiMarketTheGraph, query).then(data => {
        return resolve(true);
      });

    } catch (error) {
      console.error(error);
      return reject(false);
    }
  })
}

const statusDescMap = (deal, claim) => {
  switch (deal.state) {
    case 1:
      if (deal.currentClaim != "0") {
        if (claim.solvedAt && claim.ruling === "2") {
          return "CLAIM_WON_BY_BUYER";
        } else if (claim.solvedAt) {
          const claimLimitReaches = deal.claimCount === 3;
          if (claimLimitReaches) {
            return "CLAIM_REJECTED_LIMIT_REACHED";
          }
          return "CLAIM_REJECTED";
        }
      }
      return "ORDER_CREATED";
    case 2:
      return "ORDER_DISPUTE_RECEIVER_FEE_PENDING";
    case 3:
      return "ORDER_DISPUTE_IN_PROGRESS";
    case 4:
      if (deal.claimCount > 0 && claim.ruling == "0") {
        return "ORDER_REFUNDED";
      }
      if (deal.claimCount > 0 && claim.ruling == "2") {
        return "CLAIM_WON_BY_BUYER";
      }
      return "ORDER_PAID";
    default:
      return "UNKNOWN_STATE";
  }
}

module.exports = {
  dealCreatedsInfo,
  statusDescMap
}