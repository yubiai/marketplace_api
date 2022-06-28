const { Category } = require("../models/Category");
const { Subcategory } = require("../models/Subcategory");
const { Item } = require("../models/Item");
const { Profile } = require("../models/Profile");
const fleek = require("../utils/fleek");
const fs = require("fs");

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
      for (const file of files) {
        const { path } = file;
        console.log(path);
        fs.unlinkSync(path);
      }
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
      return res.status(400).json({
        message: "SubCategory is missing.",
      });
    }

    const uploader = async (path) => await fleek.uploads(path);

    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath.publicUrl);
      fs.unlinkSync(path);
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
      pictures: urls,
      currencySymbolPrice: req.body.currencySymbolPrice || "ETH",
    });

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
