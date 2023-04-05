const { Item } = require("../models/Item");
const { Transaction, Order } = require("../models/Order");

// Get Item Slug By Deal Id
async function getItemSlugByDealId(req, res) {

    try {
        const { deal_id } = req.params;

        const transaction = await Transaction.findOne({
            transactionIndex: deal_id
        })

        if (!transaction) {
            return res.status(204).end();
        }


        const order = await Order.findOne({
            transactionHash: transaction.transactionMeta.transactionHash
        })

        if (!order || order.status !== "ORDER_DISPUTE_IN_PROGRESS") {
            return res.status(204).end();
        }

        const item = await Item.findById(order.itemId);

        if (!item) {
            return res.status(204).end();
        }

        return res.status(200).json({
            itemId: item._id,
            slug: item.slug
        })
    } catch (err) {
        console.error(err);
        return
    }

}

module.exports = {
    getItemSlugByDealId
};
