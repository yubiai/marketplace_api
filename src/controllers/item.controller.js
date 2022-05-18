const { Category } = require("../models/Category");
const { Item } = require("../models/Item");
const { Payment } = require("../models/Payment");
const fleek = require("../utils/fleek");
const fs = require("fs");

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
  console.log("Arranco");
  const urls = [];
  const files = req.files;

  try {
    // Validate
    const body = Object.keys(req.body);
    console.log(body, "1");
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

    console.log(req.body);

    const uploader = async (path) => await fleek.uploads(path);

    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath.publicUrl);
      fs.unlinkSync(path);
    }

    console.log(urls, "urlss");

    const item = new Item({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      seller: req.body.seller,
      maxorders: req.body.maxorders,
      category: req.body.category,
      subcategory: req.body.subcategory,
      pictures: urls,
    });

    console.log(item, "item")

    let saveItem = await item.save();
    console.log(saveItem, "saveItem")
    res.status(200).json({
      message: "Item agregado con éxito!",
      result: saveItem,
    });
  } catch (error) {
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
    const item = await Item.find({ slug: req.params.slug });

    res.status(200).json({
      status: "ok",
      result: item,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

// Others functions
async function getPaymendId(req, res, next) {
  try {
    const paymentId = (Math.random() * 10000).toFixed(0);
    const paymentData = await new Payment({
      id: paymentId,
      itemId: req.params.itemId,
      paid: false,
    });

    paymentData.save();

    res.status(200).json({
      paymentId,
    });
  } catch (error) {
    console.log(error);
  }
}

async function getItemUrl(req, res) {
  try {
    //1. verify paymentId exist in db and has been paid
    const payment = await Payment.findOne({ id: req.params.paymentId });
    //2. return url to download item
    if (payment && payment.paid === true) {
      res.status(200).json({
        url: items && items[payment.itemId] && items[payment.itemId].url,
      });
    } else {
      res.status(400).json({
        message: "Ups hubo un error!",
      });
    }
  } catch (error) {
    console.log(error);
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

module.exports = {
  newItem,
  getPaymendId,
  getItemUrl,
  getItem,
  postItem,
  getItemSlug,
  test,
};
