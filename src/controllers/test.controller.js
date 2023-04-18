const fileToIpfs = require('@kleros/file-to-ipfs');
const { Evidence } = require("../models/Evidence");
const { Order, Transaction } = require("../models/Order");
const { Channel } = require("../models/Channel");
const { Filevidence } = require("../models/Filevidence");
const { removeFileEvidence } = require('../utils/uploads');


async function uploadMetaevidence(req, res) {
    try {

        const pathMetaevidence = "./metaEvidence.json";

        console.log(pathMetaevidence)

        const pathJSONIpfs = await fileToIpfs(pathMetaevidence);
        console.log(pathJSONIpfs)

        return res.status(200).json({
            path: pathJSONIpfs
        });
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: "Ups Hubo un error!",
            error: error,
        });
    }
};

async function clearEvidence(req, res) {

    try {

        const evidences = await Evidence.find();
        console.log(evidences.length)

        for (let i = 0; i < evidences.length; i++) {
            const evidence = evidences[i];
            if (!evidence.dealId) {
                const channel = await Channel.findOne({
                    order_id: evidence.order_id
                })

                const transaction = await Transaction.findOne({
                    "transactionMeta.transactionHash": evidence.transactionHash
                })

                for (let file of evidence.files) {
                    const fileData = await Filevidence.findById(file);
                    await removeFileEvidence(fileData);
                    await Filevidence.findByIdAndDelete(file);
                    console.log("Se elimino archivo y doc")
                }

                if (transaction && transaction._id) {
                    await Transaction.findByIdAndDelete(transaction._id);
                    console.log("Se elimino Transaction")
                }

                if (channel && channel._id) {
                    await Channel.findByIdAndDelete(channel._id);
                    console.log("Se elimino Channel")
                }

                if (evidence.order_id) {
                    await Order.findByIdAndDelete(evidence.order_id);
                    console.log("Se elimino Order")
                }

                if (evidence._id) {
                    await Evidence.findByIdAndDelete(evidence._id);
                    console.log("Se elimino Evidence")
                }

                continue
            }
        }


        return res.status(200).json("OK")
    } catch (err) {
        console.error(err);
        return res.status(404).json("Error")
    }
}

module.exports = {
    uploadMetaevidence,
    clearEvidence
};
