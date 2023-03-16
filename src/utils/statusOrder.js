
const statusDescMap = (deal, claim) => {
    switch (deal.dealStatus) {
      case 1:
        if (claim.claimID != "0") {
          if (claim.claimSolvedAt && claim.claimStatus === "2") {
            return "CLAIM_WON_BY_BUYER";
          } else if (claim.claimSolvedAt) {
            const claimLimitReaches = claim.claimCount === claim.maxClaimsAllowed;
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
        if(claim.claimCount > 0 && claim.claimStatus == "0"){
          return "ORDER_REFUNDED";
        }
        if(claim.claimCount > 0 && claim.claimStatus == "2"){
          return "CLAIM_WON_BY_BUYER";
        }
        return "ORDER_PAID";
      default:
        return "UNKNOWN_STATE";
    }
  }

module.exports = {
    statusDescMap
}