const { Evidence } = require("../models/Evidence");
const { Item } = require("../models/Item");
const { Transaction, Order } = require("../models/Order");
const axios = require('axios');
const fs = require('fs');
const { validateSignature } = require("../utils/evidenceGenerator");

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

        if (evidence && evidence._doc) {
            return res.status(200).json(evidence._doc)
        }

        return res.status(204).end();
    } catch (err) {
        console.error(err);
        return res.status(204).end();
    }
}

async function getValidateSignature(req, res) {

    const { signature, filepath } = req.body;

    try {
        const response = await axios({
            url: process.env.KLEROS_IPFS + filepath,
            responseType: 'stream'
        });

        if (response.status === 200) {
            const dividerFilePath = filepath.split('/');
            const pathPDF = './upload/' + dividerFilePath[dividerFilePath.length - 1];
            const writer = fs.createWriteStream(pathPDF);
            response.data.pipe(writer);

            writer.on('finish', async () => {
                try {
                    const validate = await validateSignature(signature, pathPDF);
                    // Delete File
                    fs.unlinkSync(pathPDF);
                    return res.status(200).json({
                        signatureValid: validate
                    });
                } catch (error) {
                    return res.status(400).json({
                        error
                    });
                }
            });
        } else {
            return res.status(response.status).end();
        }
    } catch (error) {
        return res.status(400).json({
            error: "Signature or file Fail"
        });
    }
}

module.exports = {
    getItemSlugByDealId,
    getEvidenceByClaimID,
    getValidateSignature
};
