const { DisputesPolicy } = require("../models/DisputePolicy");
const { Profile } = require("../models/Profile");
const { Order } = require("../models/Order");

// Find last true disputes policy
async function getDPolicyLast(req, res) {
  try {
    const disputePolicy = await DisputesPolicy.findOne({
      last: true
    });

    if (!disputePolicy) {
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

async function acceptDPolicyByTransactionHash(req, res) {

  const { idDisputepolicy, user_id, transactionHash } = req.body;

  if (!idDisputepolicy || !user_id || !transactionHash) {
    return res.status(404).json({ message: "Data missing." });
  }

  try {

    // Get User Seller
    const profile = await Profile.findById(user_id);
    console.log(profile);

    if (!profile) {
      throw new Error("User not exist");
    }

    // Check if it exists Dispute Policy
    const orderByTransactionHash = await Order.findOne({
      transactionHash: transactionHash
    });

    if (!orderByTransactionHash) {
      throw new Error("Order not exist");
    }

    const profile_eth_address = profile.eth_address && profile.eth_address.toUpperCase();
    const order_id_buyer = orderByTransactionHash.userBuyer && orderByTransactionHash.userBuyer.toUpperCase();

    // Verify Order buyer with Porfile eth address
    if(profile_eth_address != order_id_buyer){
      throw new Error("The user does not have this order.");
    }

    // Check if it exists Dispute Policy
    const verifyDPolicy = await DisputesPolicy.exists({
      _id: idDisputepolicy
    });

    if (!verifyDPolicy) {
      throw new Error("Dispute Policy not exist");
    }

    // Update
    await Profile.findByIdAndUpdate(profile._id, {
      disputespolicy: [
        ...profile.disputespolicy,
        {
          idDisputepolicy: idDisputepolicy,
          transacitionHash: transactionHash,
          date: new Date()
        }
      ]
    });

    return res.status(200).json({
      status: "ok"
    });
  } catch (error) {
    console.error(error)
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

async function verifyAcceptDPolicy(req, res) {

  const { user_id, transactionHash } = req.body;

  if (!user_id || !transactionHash) {
    return res.status(404).json({ message: "Data missing." });
  }

  try {

    // Get User Seller
    const profile = await Profile.findById(user_id);

    if (!profile) {
      throw new Error("User not exist");
    }

    // Check if it exists Dispute Policy
    const orderByTransactionHash = await Order.findOne({
      transactionHash: transactionHash
    });

    if (!orderByTransactionHash) {
      throw new Error("Order not exist");
    }

    const profile_eth_address = profile.eth_address && profile.eth_address.toUpperCase();
    const order_id_buyer = orderByTransactionHash.userBuyer && orderByTransactionHash.userBuyer.toUpperCase();

    // Verify Order buyer with Porfile eth address
    if(profile_eth_address != order_id_buyer){
      throw new Error("The user does not have this order.");
    }

    const disputespolicy = profile.disputespolicy;
    const verifyAcceptByTransactionHash = disputespolicy.length > 0 && disputespolicy.find((dispute) => dispute.transacitionHash === transactionHash);

    if (!verifyAcceptByTransactionHash) {
      return res.status(200).json({
        accept: false,
        message: "Dispute Policy not accept."
      });
    }

    const lastDisputePolicy = await DisputesPolicy.findOne({
      last: true
    });

    if (!lastDisputePolicy) {
      console.error("Dispute Policy is missing.")
      throw new Error("Dispute Policy is missing.");
    }

    if (verifyAcceptByTransactionHash.idDisputepolicy != lastDisputePolicy._id) {
      //"The last contract is not accepted Dispute Policy.
      return res.status(200).json({
        accept: false,
        message: "The last contract is not accepted Dispute Policy."
      });
    }

    return res.status(200).json({
      accept: true
    });
  } catch (error) {
    console.error(error)
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}


module.exports = {
  getDPolicyLast,
  acceptDPolicyByTransactionHash,
  verifyAcceptDPolicy
};
