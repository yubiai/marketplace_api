const { ethers } = require("ethers");
const cron = require('node-cron');

const abis = require("../data/abis");
const { statusDescMap } = require("../utils/statusOrder");
const { Profile } = require("../models/Profile");
const { Notification } = require("../models/Notifications");
const { Order, Transaction } = require("../models/Order");

const contractAddress = process.env.CONTRACT_ADDRESS;

const refreshOrders = async () => {
    console.log("Inicia Refresh Orders")

    try {
        // Initial Contact
        const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_INFURA);
        const contract = new ethers.Contract(contractAddress, abis, provider);

        // Settings
        const settings = await contract.settings();

        // Variables
        const listOrders = await Order.find();

        for (let i = 0; i < listOrders.length; i++) {
            let order = listOrders[i];

            try {
                // Revisa orders con el estado dispute in progress
                if (order.status && order.status === "ORDER_DISPUTE_IN_PROGRESS") {
                    let transaction = await Transaction.findOne({
                        'transactionMeta.transactionHash': order.transactionHash
                    });

                    const dealId = transaction.transactionIndex;
                    const dealInfo = await contract.deals(dealId);

                    if (dealInfo.state !== 3) {
                        const isOver = await contract.isOver(dealId);

                        let claimInfo;
                        let disputeId;
                        let formattedClaimInfo = {};

                        if (dealInfo.currentClaim) {
                            claimInfo = await contract.claims(dealInfo.currentClaim);
                            disputeId = claimInfo.disputeId;
                            formattedClaimInfo = {
                                claimID: dealInfo.currentClaim,
                                claimStatus: (claimInfo || {}).ruling,
                                claimCreatedAt: parseInt((claimInfo || {}).createdAt, 10),
                                claimSolvedAt: parseInt((claimInfo || { solvedAt: 0 }).solvedAt),
                                claimCount: parseInt(dealInfo.claimCount, 10),
                                disputeId: parseInt(disputeId, 10),
                                timeForClaim: parseInt(dealInfo.timeForClaim, 10),
                                maxClaimsAllowed: parseInt(settings.maxClaims, 10),
                            };
                        }

                        const result = {
                            deal: {
                                dealId,
                                dealStatus: dealInfo.state,
                                dealCreatedAt: parseInt((dealInfo || {}).createdAt, 10),
                                timeForService: parseInt(dealInfo.timeForService, 10),
                                isOver,
                            },
                            claim: {
                                ...formattedClaimInfo,
                            },
                        }

                        // Update Transaction
                        await Transaction.findByIdAndUpdate(transaction._id, {
                            claimCount: result.claim.claimCount,
                            disputeId: result.claim.disputeId,
                            transactionState: result.deal.dealStatus,
                            currentClaim: result.claim.claimID,
                        })

                        let newStatus = statusDescMap(result.deal, result.claim);

                        // Update Order
                        await Order.findByIdAndUpdate(order._id, {
                            status: newStatus
                        });

                        console.log("-----------------------------------------------");
                        console.log("- Update Data Transaction ID:", transaction._id);
                        console.log("- Update Data Order ID:", order._id);
                        console.log("- Update Status Old: ", order.status, "- New: ", newStatus);

                        // Get User Seller
                        const profileSeller = await Profile.findOne({
                            eth_address: order.userSeller.toUpperCase()
                        })

                        // Get User Seller
                        const profileBuyer = await Profile.findOne({
                            eth_address: order.userBuyer.toUpperCase()
                        })

                        // Notification Seller
                        const newNotiSeller = new Notification({
                            user_id: profileSeller._id,
                            type: "DISPUTE_WAS_DECIDED_SELLER",
                            reference: order.transactionHash
                        });

                        await newNotiSeller.save();

                        // Notification Buyer
                        const newNotiBuyer = new Notification({
                            user_id: profileBuyer._id,
                            type: "DISPUTE_WAS_DECIDED_BUYER",
                            reference: order.transactionHash
                        });

                        await newNotiBuyer.save();

                        console.log("- Notifications sended - END -");
                    }
                }
                continue
            } catch (err) {
                console.error("Error Order ID: ", order._id);
                console.error(err);
                continue
            }
        }

        console.log("Finish Refresh Orders")
        return
    } catch (err) {
        console.error("Error Refresh Orders")
        console.error(err);
        return
    }
}

const refreshOrdersCron = async () => {

    cron.schedule(`*/1 * * * *`, async () => {
        await refreshOrders()
    });

}

module.exports = {
    refreshOrdersCron
};