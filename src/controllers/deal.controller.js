const { Evidence } = require("../models/Evidence");
const { Item } = require("../models/Item");
const { Transaction, Order } = require("../models/Order");
const axios = require('axios');
const fs = require('fs');
const { validateSignature } = require("../utils/evidenceGenerator");
const { Profile } = require("../models/Profile");

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

        if (!evidence) {
            return res.status(204).end();
        }

        const verifyOrder = await Order.findById(evidence._doc.order_id).populate({
            path: 'itemId',
            model: 'Item',
            select: { title: 1, slug: 1 }
        });

        let newListMessages = [];

        if (evidence.messages && evidence.messages.length > 0) {
            for (let message of evidence.messages) {
                const profile = await Profile.findById(message.user);
                let newMessage = {
                    ...message,
                    user: {
                        name: profile._doc.name
                    }
                }
                newListMessages.push(newMessage)
            }
        }


        let result = {
            ...evidence._doc,
            order: verifyOrder._doc,
            messages: newListMessages
        }

        return res.status(200).json(result)
    } catch (err) {
        console.error(err);
        return res.status(204).end();
    }
}

async function getValidateSignature(req, res) {
    const { signature, pathpdf, evidence_id } = req.body;

    try {

        if(!signature || !pathpdf || !evidence_id){
            return res.status(400).json({
                error: "Signature / Path PDF / Evidence is missing."
            });
        }

        const verifyEvidence = await Evidence.findById(evidence_id);

        if(!verifyEvidence){
            return res.status(400).json({
                error: "Evidence not exist."
            });
        }

        if(verifyEvidence._doc.url_ipfs_pdf !== pathpdf){
            return res.status(400).json({
                error: "Path pdf no valid"
            });
        }

        if(verifyEvidence._doc.fileSignature !== signature){
            return res.status(400).json({
                error: "Signature no valid"
            });
        }

        const response = await axios({
            url: process.env.KLEROS_IPFS + pathpdf,
            responseType: 'stream'
        });

        if (response.status === 200) {
            const dividerFilePath = pathpdf.split('/');
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
