const { Category } = require("../models/Category");
const { Subcategory } = require("../models/Subcategory");
const { Item } = require("../models/Item");
const { Profile } = require("../models/Profile");
const { removeFiles } = require("../utils/utils");
const { uploadFile } = require("../utils/uploads");
const { File } = require("../models/File");
const { useImagesUpload } = require("../libs/useRabbit");

// Publish Item
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

    for (const file of filesUpload) {
      console.log(file, "fileee")
      const result = await uploadFile(file, profileID);
      files.push(result._id)
    }

    newItem = {
      ...newItem,
      files: files
    }

    const item = new Item(newItem)

    const savedItem = await item.save();

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
      await useImagesUpload("images.upload", verifyFile)
      continue
    }

    console.log(savedItem, "FinishS")
    return res.status(200).json({
      message: "Item added successfully!",
      result: savedItem
    });
  } catch (error) {
    await removeFiles(files)
    return res.status(400).json({
      message: error && error.message ? error.message : "Failed to post.",
    });
  }
}

module.exports = {
  newItem,
};
