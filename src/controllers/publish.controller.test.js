const { Category } = require("../models/Category");
const { Subcategory } = require("../models/Subcategory");
const { Item } = require("../models/Item");
const { Profile } = require("../models/Profile");
const { removeFiles, changeNameFileRandom } = require("../utils/utils");
const { upload_gc, convertWebp } = require("../utils/uploads");

// Publish Item
async function newItem(req, res) {
  const urls = [];
  const files = req.files;

  try {
    // Step 1 - Validates
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
      console.error("Data is missing.")
      throw new Error("Data is missing.");
    }

    // Verify Profile
    const profileID = req.body.seller;
    const verifyProfile = await Profile.findOne({
      _id: profileID,
    });

    // If Fail
    if (!verifyProfile) {
      console.error("Profile is missing.")
      throw new Error("Profile is missing.");
    }

    // Verify Category
    const categoryID = req.body.category;
    const verifyCategory = await Category.findOne({
      _id: categoryID,
    });

    // If Fail
    if (!verifyCategory) {
      console.error("Category is missing.")
      throw new Error("Category is missing.");
    }

    // Verify Sub Category
    const subCategoryID = req.body.subcategory;
    const verifySubCategory = await Subcategory.findOne({
      _id: subCategoryID,
    });

    // If Fail
    if (!verifySubCategory) {
      console.error("SubCategory is missing.")
      throw new Error("SubCategory is missing.");
    }

    const uploader_gc = async (path) => await upload_gc(path);
    console.log(files, "fiessss")
    for (const file of files) {
      console.log(file, "fileee")

      if (file.mimetype === "video/mp4") {
        // change name
        const newFilenamePath = await changeNameFileRandom(file, ".mp4")
        console.log(newFilenamePath, "newFilenamePathnewFilenamePath")
        const resultUrlPath = await uploader_gc(newFilenamePath);
        console.log(resultUrlPath)
        urls.push({
          type: file.mimetype,
          name: resultUrlPath
        });
        continue;
      }

      if (file.mimetype === "audio/mpeg") {
        // change name
        const newFilenamePath = await changeNameFileRandom(file, ".mp3")
        console.log(newFilenamePath, "newFilenamePathnewFilenamePath")
        const resultUrlPath = await uploader_gc(newFilenamePath);
        console.log(resultUrlPath)
        urls.push({
          type: file.mimetype,
          name: resultUrlPath
        });
        continue;
      }

      if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
        const newFileWebp = await convertWebp(file)
        const resultUrlPath = await uploader_gc(newFileWebp);
        urls.push({
          type: "image/webp",
          name: resultUrlPath
        });
        continue;
      }

      continue;
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
      message: "Item added successfully!",
      result: savedItem,
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
