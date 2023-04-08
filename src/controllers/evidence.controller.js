const { Evidence } = require("../models/Evidence");
const { Profile } = require("../models/Profile");
const { Order, Transaction } = require("../models/Order");
const { Channel } = require("../models/Channel");

const { Filevidence } = require("../models/Filevidence");
const { uploadFileEvidence } = require("../utils/uploads");
const { getTransactionUrl } = require("../utils/utils");
const { pdfGenerator } = require("../utils/evidenceGenerator");

async function getEvidenceByOrderId(req, res) {
  const { id } = req.params;

  try {
    const evidence = await Evidence.find({
      order_id: id,
    }).populate("author", "first_name last_name photo eth_address")

    return res.status(200).json(evidence);
  } catch (error) {
    console.error(error)
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

async function getEvidenceById(req, res) {
  const { id } = req.params;

  try {
    const evidence = await Evidence.findById(id)
      .populate("author", "first_name last_name photo eth_address")
      .populate({
        path: 'files',
        model: 'Filevidence',
        select: { filename: 1, mimetype: 1 }
      })

    let messages = [];

    for (let msg of evidence.messages) {

      if (msg.user) {
        const user = await Profile.findById(msg.user, "first_name last_name")
        msg.user = user ? user : null;
      }

      if (msg.file) {
        const filevidence = await Filevidence.findById(msg.file);
        msg.file = filevidence ? filevidence : null;
      }

      messages.push(msg);

    }

    evidence.messages = messages;
    return res.status(200).json(evidence);
  } catch (error) {
    console.error(error)
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

async function getFilesEvidenceByOrderId(req, res) {
  const { id } = req.params;

  try {
    const filesEvidence = await Filevidence.find({
      order_id: id,
    }).populate("author", "first_name last_name photo eth_address")


    if (!filesEvidence || filesEvidence.length === 0) {
      throw new Error("filesEvidence is missing.");
    }

    return res.status(200).json(filesEvidence);
  } catch (error) {
    console.error(error)
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

async function newEvidence(req, res) {
  const { id } = req.params;
  const newItem = req.body;
  const filesUpload = req.files;
  let files = [];
  let fileDataList = [];
  let messages = [];

  try {

    // Step 1 - Validates
    const body = Object.keys(newItem);
    const allowedCreates = [
      "title",
      "description",
      "order_id",
      "transactionHash",
      "value_to_claim",
      "author",
      "author_address",
      "selectedMsgs"
    ];

    const isValidOperation = body.every((elem) =>
      allowedCreates.includes(elem)
    );

    // If Fail
    if (!isValidOperation) {
      console.error("Data is missing.")
      throw new Error("Data is missing.");
    }

    // Verify Profile
    const profileID = newItem.author;
    const verifyProfile = await Profile.findById(profileID)

    // If Fail
    if (!verifyProfile) {
      console.error("Profile is missing.")
      throw new Error("Profile is missing.");
    }

    // Verify TransactionHash
    const verifyOrder = await Order.findOne({
      transactionHash: id
    }).lean().populate({
      path: 'itemId',
      model: 'Item',
    });

    // If Fail
    if (!verifyOrder) {
      console.error("Order is missing.")
      throw new Error("Order is missing.");
    }

    const verifyTransaction = await Transaction.findOne({
      "transactionMeta.transactionHash": verifyOrder.transactionHash
    })

    if (!verifyTransaction) {
      console.error("Transaction is missing.")
      throw new Error("Transaction is missing.");
    }
    
    // Verify TransactionHash
    const verifyChannel = await Channel.findOne({
      order_id: verifyOrder._id
    });

    // If Fail
    if (!verifyChannel) {
      console.error("Channel is missing.")
      throw new Error("Channel is missing.");
    }

    // Step 2 - Selected Msgs save in messages
    if (newItem.selectedMsgs && newItem.selectedMsgs.length > 0) {
      const selectedMsgs = newItem.selectedMsgs.split(',')
      for (const msg_id of selectedMsgs) {
        let resultSelected = verifyChannel.messages.find((msg) => msg._id == msg_id);
        if(resultSelected && resultSelected.file){
          let resultFile = await Filevidence.findById(resultSelected.file);
          resultSelected = {
            ...resultSelected._doc,
            file: resultFile
          }
          messages.push(resultSelected);
        } else {
          messages.push(resultSelected);
        }

      }
    }


    // Step 3 - Upload Files
    for (const file of filesUpload) {
      const result = await uploadFileEvidence(file);

      const newFilevidence = new Filevidence({
        filename: result,
        mimetype: file.mimetype,
        author: newItem.author,
        order_id: newItem.order_id
      })

      const resultNewFilevidence = await newFilevidence.save();
      fileDataList.push(resultNewFilevidence);
      files.push(resultNewFilevidence._id);
    }

    // Step 4 - Saving new evidence
    newItem.messages = messages;
    newItem.files = files;
    //const item = new Evidence(newItem);
    //const savedItem = await item.save();
    //console.log("Evidence added successfully, ID:" + savedItem._id);

    // Step 5 - Generate PDF
    const dataToGenerateThePDF = {
      item: {
        title: verifyOrder.itemId.title,
        url: `${process.env.FRONT_URL}/item/${verifyOrder.itemId.slug}`
      },
      order: {
        date: verifyOrder.dateOrder,
        transactionHash: verifyOrder.transactionHash,
        transactionHashURL: getTransactionUrl(verifyTransaction.networkEnv, verifyOrder.transactionHash),
        red: verifyTransaction.networkEnv,
        seller: verifyOrder.userSeller.toLowerCase(),
        buyer: verifyOrder.userBuyer.toLowerCase(),
      },
      evidence: {
        value_to_claim: newItem.value_to_claim,
        title: newItem.title,
        description: newItem.description,
        author_id: newItem.author,
        author_address: newItem.author_address.toLowerCase(),
        messages: newItem.messages,
        files: fileDataList
      }
    }

    await pdfGenerator(dataToGenerateThePDF);
    throw "error al submit"

    // Step X - Finish
    return res.status(200).json({
      message: "Item added successfully!",
      result: {
        ...savedItem,
        files: [...fileDataList]
      }
    });

  } catch (error) {
    console.error(error)
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

module.exports = {
  getEvidenceByOrderId,
  getEvidenceById,
  getFilesEvidenceByOrderId,
  newEvidence
};
