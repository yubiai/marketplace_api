const fileToIpfs = require('@kleros/file-to-ipfs');
const { Evidence } = require("../models/Evidence");
const { Order, Transaction } = require("../models/Order");
const { Channel } = require("../models/Channel");
const { Filevidence } = require("../models/Filevidence");
const { removeFileEvidence } = require('../utils/uploads');
const PushAPI = require('@pushprotocol/restapi')
const ethers = require('ethers');
const { Item } = require('../models/Item');

async function testNotificationPush(req, res) {
    const PK = process.env.PRIVATE_WALLET_KEY;
    try {
        const Pkey = `0x${PK}`;
        const signer = new ethers.Wallet(Pkey);

        const apiResponse = await PushAPI.payloads.sendNotification({
            signer: signer,
            type: 4, // target
            identityType: 2, // direct payload
            notification: {
                title: '[TEST] Decime si te llego',
                body: '[test] Sale Item design logo 2'
            },
            payload: {
                title: '[test] New Sale! 3',
                body: 'Sale Item design logo 3',
                cta: '',
                img: ''
            },
            recipients: ['eip155:5:0x245Bd6B5D8f494df8256Ae44737A1e5D59769aB4', 'eip155:5:0x623fb5FF84192947E8908ff6b3624c89216eB7A0'], // recipients addresses
            channel: '0xA2c51FC0d268CcA1ee0cA00Dd0D6b616028fb609', // your channel address
            env: 'prod'
        });

        console.log(apiResponse, "apiResponse")
        return res.status(200).json("Ok")

    } catch (err) {
        console.error(err);
        return res.status(404).json("Error")
    }
}


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

async function updateItemDescriptionString(req, res) {
    try {

        const items = await Item.find();

        if (items == null || items.length == 0) {
            throw "No items"
        }
        let cant = 0;

        for (let item of items) {
            if (!item.descriptionString) {
                console.log("No tiene descriptionString");
                console.log("ID", item.id);
                console.log("Slug", item.slug);
                console.log("----------------------------")
                cant = cant + 1;
            }
        }

        console.log(cant, "cantidad");

        return res.status(200).send("OK")
    } catch (error) {
        console.error(error);
        return res.status(400).json({
            message: "Ups Hubo un error!",
            error: error,
        });
    }
};


module.exports = {
    uploadMetaevidence,
    clearEvidence,
    testNotificationPush,
    updateItemDescriptionString
};
