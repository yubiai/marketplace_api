const { Item } = require("../models/Item");
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

    return res.status(200).json({
      status: "ok",
      result: item,
    });
  } catch (error) {
    return res.status(400).json({
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
      .populate("subcategory", "title")
      .populate({
        path: 'files',
        model: 'File',
        select: { filename: 1, mimetype: 1 }
      })

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
    const items = await Item.find({}, "_id title price files");

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

    let condition = {
      published: true
    };

    if (categoryId) {
      condition.category = categoryId;
    }

    if (subcategoryId) {
      condition.subcategory = subcategoryId;
    }

    const data = await Item.paginate(condition, {
      offset, limit, sort, populate: {
        path: 'files',
        model: 'File',
        select: { filename: 1, mimetype: 1 }
      }
    });

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

// Items by Search
async function search(req, res) {
  try {
    const query = req.query.q;
    console.log(query, "aca");

    const result = await Item.aggregate([
      {
        $search: {
          index: process.env.MONGODB_SEARCH,
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
          files: 1,
          price: 1,
        },
      },
    ]);

    console.log("hola")

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
  getItemSlug,
  search,
  // Olds
  getItem,
  test,
};
