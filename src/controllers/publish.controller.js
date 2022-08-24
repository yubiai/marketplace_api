const { Category } = require("../models/Category");
const { Subcategory } = require("../models/Subcategory");
const { Item } = require("../models/Item");
const { Profile } = require("../models/Profile");
const fleek = require("../utils/fleek");
const fs = require("fs");
const { removeFiles, getRandomName, changeNameFileRandomMp4 } = require("../utils/utils");
const { upload_gc, convertWebp } = require("../utils/uploads");

// Publish Item
async function newItem(req, res) {
  const urls = [];
  const files = req.files;

  try {
    // Validates
    const body = Object.keys(req.body);
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
      // Deleted Images
      await removeFiles(files)
      console.log("Data is missing ");
      return res.status(400).json({
        message: "Data is missing ",
      });
    }

    // Verify Profile
    const profileID = req.body.seller;
    const verifyProfile = await Profile.findOne({
      _id: profileID,
    });

    if (!verifyProfile) {
      // Deleted Images
      await removeFiles(files)
      return res.status(400).json({
        message: "Profile is missing.",
      });
    }

    // Verify Category
    const categoryID = req.body.category;
    const verifyCategory = await Category.findOne({
      _id: categoryID,
    });

    if (!verifyCategory) {
      // Deleted Images
      await removeFiles(files)
      return res.status(400).json({
        message: "Category is missing.",
      });
    }

    // Verify Sub Category
    const subCategoryID = req.body.subcategory;
    const verifySubCategory = await Subcategory.findOne({
      _id: subCategoryID,
    });

    if (!verifySubCategory) {
      // Deleted Images
      await removeFiles(files)
      return res.status(400).json({
        message: "SubCategory is missing.",
      });
    }

    const uploader_gc = async (path) => await upload_gc(path);

    for (const file of files) {
      console.log(file, "fileee")

      if(file.mimetype === "video/mp4"){
        console.log("es video")
        // change name

        const newFilenamePath = await changeNameFileRandomMp4(file)
        console.log(newFilenamePath, "newFilenamePathnewFilenamePath")
        const resultUrlPath = await uploader_gc(newFilenamePath);
        console.log(resultUrlPath)
        urls.push(resultUrlPath);
      }

      if(file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png"){
        const newFileWebp = await convertWebp(file)
        const resultUrlPath = await uploader_gc(newFileWebp);
        urls.push(resultUrlPath);
      }

    }

    const item = new Item({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      seller: req.body.seller,
      maxorders: req.body.maxorders,
      category: req.body.category,
      subcategory: req.body.subcategory,
      ubiburningamount: req.body.ubiburningamount,
      files: {
        gc: urls
      },
      currencySymbolPrice: req.body.currencySymbolPrice || "ETH",
    });

    console.log(item)
    return res.json(item)

    let savedItem = await item.save();
    console.log(savedItem, "saveItem");

    // Update profile in items.
    await Profile.findByIdAndUpdate(req.body.seller, {
      items: [...verifyProfile.items, savedItem._id],
    });

    // Update category in items.
    await Category.findByIdAndUpdate(req.body.category, {
      items: [...verifyCategory.items, savedItem._id],
    });

    // Update sub category in items.
    await Subcategory.findByIdAndUpdate(req.body.subcategory, {
      items: [...verifySubCategory.items, savedItem._id],
    });

    return res.status(200).json({
      message: "Item agregado con éxito!",
      result: savedItem,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

module.exports = {
  newItem,
};
