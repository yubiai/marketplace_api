const { Category } = require("../models/Category");
const { Subcategory } = require("../models/Subcategory");
const { Item } = require("../models/Item");
const { Payment } = require("../models/Payment");
const { Profile } = require("../models/Profile");
const fleek = require("../utils/fleek");
const fs = require("fs");
const getPagination = require("../libs/getPagination");

const items = {
  1: { id: 1, url: "http://UrlToDownloadItem1" },
  2: { id: 2, url: "http://UrlToDownloadItem2" },
};

// All get Products
async function getItem(req, res) {
  try {
    const item = await Item.find({});

    res.status(200).json({
      status: "ok",
      result: item,
    });
  } catch (error) {
    res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

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
      pictures: urls,
      currencySymbolPrice: req.body.currencySymbolPrice || "ETH"
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

    res.status(200).json({
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

// New Product
async function postItem(req, res) {
  const urls = [];
  const files = req.files;

  // Validate
  const body = Object.keys(req.body);
  console.log(body);
  const allowedCreates = [
    "title",
    "price",
    "condition",
    "description",
    "seller",
    "currencySymbolPrice"
  ];
  const isValidOperation = body.every((elem) => allowedCreates.includes(elem));
  if (!isValidOperation || !req.query.categoryId) {
    // Deleted Images
    for (const file of files) {
      const { path } = file;
      console.log(path);
      fs.unlinkSync(path);
    }
    return res.status(400).json({
      message: "Data is missing ",
    });
  }

  try {
    const searchCategory = await Category.findOne({
      categoryId: req.query.categoryId,
    });

    const uploader = async (path) => await fleek.uploads(path);

    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath.publicUrl);
      fs.unlinkSync(path);
    }

    const item = new Item({
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      condition: req.body.condition,
      seller: req.body.seller,
      category: searchCategory._id,
      status: "new",
      pictures: urls,
    });

    let saveItem = await item.save();
    let updateCategory = await Category.findById(searchCategory._id);
    updateCategory.items.push(saveItem.id);
    await updateCategory.save();

    console.log("Save: ", saveItem.id);
    res.status(200).json({
      message: "Item agregado con éxito!",
    });
  } catch (error) {
    res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

// One Product by SLUG
async function getItemSlug(req, res) {
  try {
    const item = await Item.findOne({ slug: req.params.slug })
      .populate("seller", "first_name last_name photo eth_address")
      .populate("category", "title")
      .populate("subcategory", "title");

    return res.status(200).json({
      status: "ok",
      result: item,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

// Get Items All
async function getItemsAll(req, res) {
  try {
    const items = await Item.find({}, "_id title price pictures");

    return res.status(200).json({
      status: "ok",
      result: items,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

async function test(req, res) {
  try {
    const uploader = async (path) => await cloudinary.uploads(path, "Images");

    if (req.method === "POST") {
      const urls = [];
      const files = req.files;
      for (const file of files) {
        const { path } = file;
        const newPath = await uploader(path);
        urls.push(newPath);
        fs.unlinkSync(path);
      }

      res.status(200).json({
        message: "images uploaded successfully",
        data: urls,
      });
    } else {
      res.status(405).json({
        err: `${req.method} method not allowed`,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

// Items by Category
async function getItems(req, res) {
  try {
    const { size, page, categoryId, subcategoryId } = req.query;
    const { limit, offset } = getPagination(page, size);
    const sort = { item: 1 };

    let condition = {};

    if (categoryId) {
      condition.category = categoryId;
    }

    if (subcategoryId) {
      condition.subcategory = subcategoryId;
    }

    const data = await Item.paginate(condition, { offset, limit, sort });

    return res.status(200).json({
      totalItems: data.totalDocs,
      items: data.docs,
      totalPages: data.totalPages,
      currentPage: data.page - 1,
      prevPage: data.prevPage - 1,
      nextPage: data.nextPage - 1,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Ups hubo un error!",
      error: JSON.stringify(error.message)
    });
  }
}

// Items by Category
async function search(req, res) {
  try {
    const query = req.query.q;
    console.log(query);

    const result = await Item.aggregate([
      {
        $search: {
          index: "default",
          text: {
            query: query,
            path: "title",
          },
        },
      },
      {
        $project: {
          title: 1,
          slug: 1,
          pictures: 1,
          price: 1,
        },
      },
    ]);

    console.log(result, "result");

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: "Ups hubo un error!",
    });
  }
}

module.exports = {
  // News
  getItems,
  newItem,
  getItemSlug,
  search,
  // Olds
  getItem,
  postItem,
  test,
};
