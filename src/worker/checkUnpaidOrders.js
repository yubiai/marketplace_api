const cron = require('node-cron');
const ethers = require('ethers');

const { Order, Transaction } = require('../models/Order');
const YubiaiPaymentArbitrable = require('../contracts/yubiaiPaymentArbitrable');

const MAX_DAYS_LIMIT = 10;

const runCheckUnpaidOrdersJob = async () => {

    const now = new Date();
    const maxDate = now.setDate(now.getDate() - MAX_DAYS_LIMIT);

    const unpaidOrders = await Order.find({
        orderCompletedBySeller: true,
        status: "ORDER_CREATED",
        updatedAt: { $lt: maxDate }
    });

    const provider = ethers.getDefaultProvider(process.env.NETWORK_ID);

    const account = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const yubiaiArbitrableInstance = new YubiaiPaymentArbitrable(account);
    await yubiaiArbitrableInstance.initContract();

    unpaidOrders.forEach(async (order) => {
        const transaction = await Transaction.findOne({
            'transactionMeta.transactionHash': order.transactionHash,
        });

        console.log("Releasing payment for dealId ", transaction.transactionIndex);
        try {
            await yubiaiArbitrableInstance.payDeal(transaction.transactionIndex);
        } catch (e) {
            console.error("Error releasing payment: ", e);
            return;
        }

        Order.findByIdAndUpdate(order._id, { status: "ORDER_PAID" });

    });
}

const checkUnpaidOrders = async () => {

    cron.schedule(`0 0 0 * * *`, async () => {
        console.log("Check unpaid orders job starts...");
        try {
            await runCheckUnpaidOrdersJob();
            console.log("Check unpaid orders job finished...");
        }
        catch (e) {
            console.error('Error executing job: ', e);
        }

    })

}

module.exports = checkUnpaidOrders;