const { Evidence } = require("../models/Evidence");
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
        return res.status(204).end();
    }

}

async function getEvidenceByClaimID(req, res) {

    try {
        const { claimID } = req.params;

        if (!claimID) {
            return res.status(204).end();
        }

        const evidence = await Evidence.findOne({
            claimID: claimID
        }).populate({
            path: 'files',
            model: 'Filevidence',
            select: { filename: 1, mimetype: 1 }
        })

        return res.status(200).json(evidence._doc)
    } catch (err) {
        console.error(err);
        return res.status(204).end();
    }
}

module.exports = {
    getItemSlugByDealId,
    getEvidenceByClaimID
};
