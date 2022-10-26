const { DisputesPolicy } = require("../models/DisputePolicy");

// Find last true disputes policy
async function getDPolicyLast(req, res) {
  try {
    const disputePolicy = await DisputesPolicy.findOne({
      last: true
    });

    if(!disputePolicy){
      console.error("Dispute Policy is missing.")
      throw new Error("Dispute Policy is missing.");
    }

    return res.status(200).json(disputePolicy);

  } catch (error) {
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

module.exports = {
  getDPolicyLast
};
