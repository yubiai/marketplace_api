const { Category } = require("../models/Category");
const { Subcategory } = require("../models/Subcategory");
const { Item } = require("../models/Item");
const { Profile } = require("../models/Profile");
const { removeFiles } = require("../utils/utils");
const { uploadFile } = require("../utils/uploads");
const { File } = require("../models/File");
const { sendMsgBot } = require("../worker/botAlert.worker");
const { logger } = require("../utils/logger");

// New Item
async function newItem(req, res) {
  let newItem = req.body;
  let filesUpload = req.files;
  let files = [];

  try {
    // Step 1 - Validates
    const body = Object.keys(newItem);
    const allowedCreates = [
      "title",
      "description",
      "price",
      "seller",
      "maxorders",
      "category",
      "subcategory",
      "currencySymbolPrice",
      "ubiburningamount"
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
    const profileID = newItem.seller;
    const verifyProfile = await Profile.findOne({
      _id: profileID,
    });

    // If Fail
    if (!verifyProfile) {
      console.error("Profile is missing.")
      throw new Error("Profile is missing.");
    }

    // Verify Category
    const categoryID = newItem.category;
    const verifyCategory = await Category.findOne({
      _id: categoryID,
    });

    // If Fail
    if (!verifyCategory) {
      console.error("Category is missing.")
      throw new Error("Category is missing.");
    }

    // Verify Sub Category
    const subCategoryID = newItem.subcategory;
    const verifySubCategory = await Subcategory.findOne({
      _id: subCategoryID,
    });

    // If Fail
    if (!verifySubCategory) {
      console.error("SubCategory is missing.")
      throw new Error("SubCategory is missing.");
    }

    // Verify Files
    if (!filesUpload || filesUpload.length < 1) {
      console.error("Files is missing.");
      throw new Error("Files is missing.")
    }

    // Step 2 - Upload Files
    async function uploadFiles(filesUpload, profileID) {
    
      for (const file of filesUpload) {
        const result = await uploadFile(file, profileID);
        files.push(result._id)
      }
    
      return;
    }

    await uploadFiles(filesUpload, profileID);

    // Step 3 - Adding properties
    newItem = {
      ...newItem,
      files: files,
      currencySymbolPrice: newItem.currencySymbolPrice,
      status: 1
    }

    // Step 4 - Saving new item
    const item = new Item(newItem)
    const savedItem = await item.save();

    // Step 5 - Adding your relationships

    // Update profile in items.
    await Profile.findByIdAndUpdate(newItem.seller, {
      items: [...verifyProfile.items, savedItem._id],
    });

    // Update category in items.
    await Category.findByIdAndUpdate(newItem.category, {
      items: [...verifyCategory.items, savedItem._id],
    });

    // Update sub category in items.
    await Subcategory.findByIdAndUpdate(newItem.subcategory, {
      items: [...verifySubCategory.items, savedItem._id],
    });

    // Step 6 - Save files items
    async function updateFiles(savedItem) {
      await Promise.all(savedItem.files.map(async (file) => {
        const verifyFile = await File.findOne({ _id: file });
        if (!verifyFile) {
          console.error(`File ${file} does not exist`);
          return;
        }
        await File.findByIdAndUpdate(file, { items: [...verifyFile.items, savedItem._id] });
      }));
    }

    await updateFiles(savedItem);


    // Step 7 - Finish and Notifications
    sendMsgBot("newItem", savedItem._id);

    logger.info(`Item added successfully, ID: ${savedItem._id} - By Id: ${profileID}`)
    return res.status(200).json({
      message: "Item added successfully!",
      result: savedItem
    });
  } catch (error) {
    // if an error is caught the files are deleted
    await removeFiles(files)

    // Finish
    return res.status(400).json({
      message: error && error.message ? error.message : "Failed to post.",
    });
  }
}

const updateStatusItem = async (req, res) => {
  const { status } = req.body;
  const id = req.params.id;

  console.log(status, "activo")

  try {

    const item = await Item.findById(id);

    if (!item) {
      throw new Error("Item is missing.");
    }

    await Item.findByIdAndUpdate(id, {
      status: status,
      published: status == 2 ? true : false
    })

    if (status == 1) {
      sendMsgBot("updateItem", id);
    }

    return res.status(200).json({
      status: "ok"
    });
  } catch (error) {
    console.error(error)
    return res.status(400).json({
      message: 'Ups Hubo un error!',
      error: error,
    })
  }
}

const updateItemFiles = async (req, res) => {

  const id = req.params.id;
  const { filespos } = req.body;
  let filesUpload = req.files;
  let files = [];

  if (filespos[0] == "false" && filespos[1] == "false" && filespos[2] == "false") {
    return res.status(200).json({
      status: "ok"
    });
  }

  try {

    const item = await Item.findById(id);

    if (!item) {
      console.error("Item is missing.");
      throw new Error("Item is missing.");
    }

    for (let i = 0; i < filespos.length; i++) {
      if (filespos[i] == "false") {
        files[i] = item.files[i];
      } else {
        const findFile = filesUpload.find((file) => file.originalname === filespos[i]);
        if (!findFile) {
          continue;
        }
        const result = await uploadFile(findFile, item.seller);
        files[i] = result._id;
        continue;
      }
    }

    await Item.findByIdAndUpdate(id, {
      files: files
    });

    return res.status(200).json({
      status: "ok"
    });
  } catch (error) {
    console.error(error)
    return res.status(400).json({
      message: 'Ups Hubo un error!',
      error: error,
    })
  }
}

module.exports = {
  newItem,
  updateStatusItem,
  updateItemFiles
};
