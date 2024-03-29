const cron = require('node-cron');
const { Profile } = require("../models/Profile");
const { Notification } = require("../models/Notifications");
const { Order } = require("../models/Order");
const { logger } = require("../utils/logger");
const { sendNotiTargeted } = require("../utils/pushProtocolUtil");

const refreshOrderStatus = async () => {
    try {
        const currentDate = new Date();
        const listOrders = await Order.find({ "status": "ORDER_DISPUTE_IN_PROGRESS" });

        if (listOrders.length > 0) {

            for (let i = 0; i < listOrders.length; i++) {
                let order = listOrders[i];
                if (order.disputeEndDate && order.disputeEndDate < currentDate && !order.notified) {
                    try {
                        logger.info("Order vencida", order._id)
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
                        sendNotiTargeted(order.userSeller.toLowerCase(), "DISPUTE_WAS_DECIDED", order._id);

                        // Notification Buyer
                        const newNotiBuyer = new Notification({
                            user_id: profileBuyer._id,
                            type: "DISPUTE_WAS_DECIDED_BUYER",
                            reference: order.transactionHash
                        });

                        await newNotiBuyer.save();
                        sendNotiTargeted(order.userBuyer.toLowerCase(), "DISPUTE_WAS_DECIDED", order._id);

                        // Update Order
                        await Order.findByIdAndUpdate(order._id, {
                            notified: true
                        });

                        logger.info("- Update Order Notifications sended - END -");

                        continue

                    } catch (err) {
                        console.error(err)
                        console.error("Error Update Order " + order._id)
                        logger.error("Error Update Order " + order._id)
                        continue
                    }

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

    cron.schedule(`*/5 * * * *`, async () => {
        await refreshOrderStatus()
    });

}

module.exports = {
    refreshOrdersCron
};