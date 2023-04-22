const { Item } = require("../models/Item");
const { File } = require("../models/File");
const getPagination = require("../libs/getPagination");
const { removeFile } = require("../utils/uploads");
const { logger } = require("../utils/logger");

// All get Products
async function getItem(req, res) {
  try {
    const item = await Item.find({});

    return res.status(200).json({
      status: "ok",
      result: item,
    });
  } catch (error) {
    console.error(error);
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
      .populate("seller", "name photo eth_address permission")
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
    logger.error(`Error getting item from this slug: ${req.params.slug ? req.params.slug : "No data"}`)
    console.error(error);
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

// One Product by Id
async function getItemById(req, res) {
  try {
    const { id } = req.params;

    const item = await Item.findById(id).populate("category", "_id title")
      .populate("subcategory", "_id title en es")
      .populate({
        path: 'files',
        model: 'File',
        select: { filename: 1, mimetype: 1 }
      })

    if (!item) {
      console.error("Item is missing.")
      throw new Error("Item is missing.");
    }

    return res.status(200).json(item);
  } catch (error) {
    logger.error(`Error getting item from this id: ${id ? id : "No data"}`)
    console.error(error);
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

async function updateItem(req, res) {

  const { title, description, category, subcategory, currencySymbolPrice, price, ubiburningamount } = req.body;
  const { id } = req.params;

  try {

    if (title || description || category || subcategory || currencySymbolPrice || price || ubiburningamount) {
      const verifyItem = await Item.findById(id);

      if (!verifyItem) {
        throw new Error("Item is missing.");
      }

      await Item.findByIdAndUpdate(id, req.body);

      return res.status(200).json({
        status: "ok"
      });

    } else {
      throw new Error("Data is missing.");
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Ups hubo un error!",
      error: JSON.stringify(error)
    });
  }
}

// Items by Category
async function getItems(req, res) {
  try {
    const { size, page, categoryId, subcategoryId } = req.query;
    const { limit, offset } = getPagination(page, size);
    const sort = { updatedAt: -1 };

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
      offset, limit, sort, populate: [
        {
          path: 'files',
          model: 'File',
          select: { filename: 1, mimetype: 1 }
        }, {
          path: 'seller',
          model: 'Profile',
          select: { name: 1 }
        }
      ]
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
    console.error(error);
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
          seller: 1
        },
      },
    ]);

    await Item.populate(result, [
      {
        path: 'files',
        model: 'File',
        select: { filename: 1, mimetype: 1 }
      },
      {
        path: 'seller',
        model: 'Profile',
        select: { name: 1 }
      }
    ])

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Ups hubo un error!",
    });
  }
}

async function deleteFileById(req, res) {

  const { file_id } = req.body;
  const { id } = req.params;

  try {

    if (file_id) {
      const verifyItem = await Item.findById(id);

      if (!verifyItem) {
        throw new Error("Item is missing.");
      }

      const verifyFile = await File.findById(file_id);

      const filterFile = verifyFile && verifyItem.files && verifyItem.files.length > 0 && verifyItem.files.filter((file) => file != file_id);

      if (!filterFile) {
        throw new Error("Error deleting file.");
      }

      await removeFile(verifyFile);

      await Item.findByIdAndUpdate(id, {
        files: filterFile
      });

      return res.status(200).json({
        status: "ok"
      });

    } else {
      throw new Error("Data is missing.");
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Ups hubo un error!",
      error: JSON.stringify(error)
    });
  }
}


module.exports = {
  // News
  getItems,
  getItemSlug,
  getItemById,
  search,
  updateItem,
  deleteFileById,
  // Olds
  getItem
  //test
};
