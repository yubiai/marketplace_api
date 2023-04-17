const { ethers } = require("ethers");
const cron = require('node-cron');

const abis = require("../data/abis");
const { statusDescMap } = require("../utils/statusOrder");
const { Profile } = require("../models/Profile");
const { Notification } = require("../models/Notifications");
const { Order, Transaction } = require("../models/Order");
const { logger } = require("../utils/logger");

const contractAddress = process.env.CONTRACT_ADDRESS;

const refreshOrderStatus = async (contract) => {
    try {

        const listOrders = await Order.find({ "status": "ORDER_DISPUTE_IN_PROGRESS" });

        if (listOrders.length > 0) {

            for (let i = 0; i < listOrders.length; i++) {
                let order = listOrders[i];

                try {
                    let transaction = await Transaction.findOne({
                        'transactionMeta.transactionHash': order.transactionHash
                    });
    
                    if (!transaction) {
                        continue
                    }
    
                    const dealId = transaction.transactionIndex;
                    const dealInfo = await contract.deals(dealId);

                    if (dealInfo.state !== 3) {
    
                        // Update Transaction ??
    
                        // Get Status
                        const claimInfo = await contract.claims(dealInfo.currentClaim);
    
                        const newStatus = statusDescMap(dealInfo, claimInfo);
                        console.log("Outdated order: " + order._id + " - Status Old " + order.status + " - Status New: " + newStatus);
                        logger.info("Outdated order: " + order._id + " - Status Old " + order.status + " - Status New: " + newStatus);
    
                        // Update Order
                        /* await Order.findByIdAndUpdate(order._id, {
                            status: newStatus
                        }); */
    
                        // Notifications Users
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
    
                        console.log("- Update Order Notifications sended - END -");
                        logger.info("- Update Order Notifications sended - END -");
    
                        continue
                    } else {
                        continue
                    }
                } catch(err){
                    console.error(err)
                    console.error("Error Update Order " + order._id)
                    logger.error("Error Update Order " + order._id)
                    continue
                }
                
            }
        }

    } catch (error) {
        logger.error("Error Refresh Orders initial")
        console.error("Error Refresh Orders initial" + error);
        return
    }
}

const refreshOrdersCron = async () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_INFURA);
    const contract = new ethers.Contract(contractAddress, abis, provider);
    cron.schedule(`*/5 * * * *`, async () => {
        await refreshOrderStatus(contract)
    });

}

module.exports = {
    refreshOrdersCron
};