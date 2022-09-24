const { Evidence } = require("../models/Evidence");
const { Profile } = require("../models/Profile");

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
    const evidence = await Evidence.findById(id).populate("author", "first_name last_name photo eth_address")

    return res.status(200).json(evidence);
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
  console.log(id, "New evidence")
  let newItem = req.body;
  let filesUpload = req.files;
  let files = [];

  try {

    // Step 1 - Validates
    const body = Object.keys(newItem);
    const allowedCreates = [
      "order_id",
      "transactionHash",
      "author",
      "author_address",
      "title",
      "description"
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

    // Step 4 - Saving new evidence
    const item = new Evidence(newItem)
    const savedItem = await item.save();

    // Step 7 - Finish
    console.log("Evidence added successfully, ID:" + savedItem._id)
    return res.status(200).json({
      message: "Item added successfully!",
      result: savedItem
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
  newEvidence
};
