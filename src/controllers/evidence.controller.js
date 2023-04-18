const { Evidence } = require("../models/Evidence");
const { Profile } = require("../models/Profile");
const { Order, Transaction } = require("../models/Order");
const { Channel } = require("../models/Channel");
const ObjectId = require("mongoose").Types.ObjectId;

const { Filevidence } = require("../models/Filevidence");
const { uploadFileEvidence, removeFileEvidence } = require("../utils/uploads");
const { getTransactionUrl } = require("../utils/utils");
const { pdfGenerator, uploadEvidenceInIPFSKleros, createdSignature, validateSignature } = require("../utils/evidenceGenerator");

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

async function getEvidencesByDealId(req, res) {
  const { dealId } = req.params;

  try {
    const evidences = await Evidence.find({
      dealId: dealId,
    }).sort({ updatedAt: -1 })

    return res.status(200).json(evidences);
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
  let messages_all = [];

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
        if (resultSelected && resultSelected.file) {
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

    // Step 4 - Saving Variables
    newItem.messages = messages;
    newItem.files = files;

    // Step 5 - Files messages in channel
    await Promise.all(
      verifyChannel.messages.map(async (message, i) => {
        if (message.file && ObjectId.isValid(message.file)) {
          const filevidenceVerify = await Filevidence.findById(message.file);
          if (!filevidenceVerify) {
            return
          }
          message.file = filevidenceVerify
          messages_all.push(message)
          return
        } else {
          messages_all.push(message)
          return
        }
      })
    )

    // Step 6 - Generate PDF
    const dataToGenerateThePDF = {
      item: {
        title: verifyOrder.itemId.title,
        url: `${process.env.FRONT_URL}/item/${verifyOrder.itemId.slug}`,
        description: verifyOrder.itemId.description,
        price: verifyOrder.itemId.price,
        currencySymbolPrice: verifyOrder.itemId.currencySymbolPrice
      },
      order: {
        date: verifyOrder.dateOrder,
        transactionHash: verifyOrder.transactionHash,
        transactionHashURL: getTransactionUrl(verifyTransaction.networkEnv, verifyOrder.transactionHash),
        red: verifyTransaction.networkEnv,
        seller: verifyOrder.userSeller.toLowerCase(),
        buyer: verifyOrder.userBuyer.toLowerCase(),
        claim_count: verifyTransaction.claimCount
      },
      evidence: {
        value_to_claim: newItem.value_to_claim,
        title: newItem.title,
        description: newItem.description,
        author_id: newItem.author,
        author_address: newItem.author_address.toLowerCase(),
        messages_all: messages_all,
        messages_selected: newItem.messages,
        files: fileDataList
      }
    }

    // Step Generator PDF
    const pathFilePDF = await pdfGenerator(dataToGenerateThePDF);
    // Step Created Signature
    const signature = await createdSignature(pathFilePDF);
    //const validate = await validateSignature(signature, pathFilePDF);
    const resultUploadIPFS = await uploadEvidenceInIPFSKleros(pathFilePDF, dataToGenerateThePDF, signature);

    newItem.url_ipfs_pdf = resultUploadIPFS.pathPDFIpfs;
    newItem.url_ipfs_json = resultUploadIPFS.pathJSONIpfs;
    newItem.fileSignature = signature;

    // Step - Saving data
    const item = new Evidence(newItem);
    const savedItem = await item.save();
    console.log("Evidence added successfully, ID:" + savedItem._id);

    // Step X - Finish
    return res.status(200).json({
      message: "Item added successfully!",
      result: {
        ...savedItem._doc,
        _id: savedItem._id,
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

// Update Status Evidence
async function updateStatus(req, res) {
  const { id } = req.params;
  const body = req.body;

  try {

    if (!id) {
      throw "id or status missing."
    }

    const verifyEvidence = await Evidence.findById(id);

    if (!verifyEvidence) {
      throw "Evidence is missing."
    }

    await Evidence.findByIdAndUpdate(id, body);

    // Clear Evidences status 0, falta eliminar los archivos.
    const evidencesFail = await Evidence.find({
      transactionHash: verifyEvidence.transactionHash,
      status: 0
    })

    for (const evidence of evidencesFail) {
      await Evidence.findByIdAndRemove(evidence._id)
    }

    return res.status(200).json("ok");
  } catch (error) {
    console.error(error)
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

async function removeEvideceOld(req, res) {
  try {
    const { id } = req.params;
    const evidence = await Evidence.findById(id);

    if (!evidence) {
      throw "Evidence is missing."
    }

    if (evidence.status === 0) {

      for (let file of evidence.files) {
        const fileData = await Filevidence.findById(file);
        await removeFileEvidence(fileData);
        await Filevidence.findByIdAndDelete(file);
      }

      await Evidence.findByIdAndDelete(id)

      return res.status(200).json("Ok")
    } else {
      throw "Evidence not status 0"
    }

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
  getEvidencesByDealId,
  getEvidenceById,
  getFilesEvidenceByOrderId,
  newEvidence,
  updateStatus,
  removeEvideceOld
};
