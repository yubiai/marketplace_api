const { Category } = require("../models/Category");
const { Subcategory } = require("../models/Subcategory");
const { Item } = require("../models/Item");
const { Profile } = require("../models/Profile");
const { removeFiles } = require("../utils/utils");
const { uploadFile } = require("../utils/uploads");
const { File } = require("../models/File");
const { useImagesUpload } = require("../libs/useRabbit");

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
    for (const file of filesUpload) {
      const result = await uploadFile(file, profileID);
      files.push(result._id)
    }

    // Step 3 - Adding properties
    newItem = {
      ...newItem,
      files: files,
      currencySymbolPrice: newItem.currencySymbolPrice || "ETH",
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

    // Step 6 - Save files to other storage
    for (const file of savedItem.files) {
      const verifyFile = await File.findOne({
        _id: file
      });
      if (!verifyFile) {
        console.error("No exists")
        continue
      }
      await File.findByIdAndUpdate(file, {
        items: [...verifyFile.items, savedItem._id],
      });
      continue
    }

    // Step 7 - Finish
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

// New Item
async function publishItem(req, res) {

  try {

    // Verify Code Security
    if (req.body.code !== process.env.CODE_SECU) {
      console.error("Command No valid")
      throw new Error("Command No valid");
    }

    // Verify Item
    const verifyProfile = await Item.findOne({
      _id: req.body.item_id,
    });

    // If Fail
    if (!verifyProfile) {
      console.error("Item is missing.")
      throw new Error("Item is missing.");
    }

    // Update Item
    await Item.findByIdAndUpdate(req.body.item_id, {
      published: true,
      status: 2
    });

    return res.status(200).json({
      message: "Updated Successfully"
    })
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: error && error.message ? error.message : "Failed to Published.",
    })
  }
}

module.exports = {
  newItem,
  publishItem
};
