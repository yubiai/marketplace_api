const cron = require('node-cron');

const { Order } = require('../models/Order');

const MAX_DAYS_LIMIT = 10;

const runCheckUnpaidOrdersJob = async () => {

    const now = new Date();
    const maxDate = now.setDate(now.getDate() - MAX_DAYS_LIMIT);

    const unpaidOrders = await Order.find({
        orderCompletedBySeller: true,
        updatedAt: { $lt: maxDate }
    });

    console.log('Orders to release payment:');
    // to do: call smart contract to release payment
    unpaidOrders.forEach(order => console.debug(order.itemId))

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