const { Item } = require("../models/Item");
const { File } = require("../models/File");
const { removeFile } = require("../utils/uploads");
const { logger } = require("../utils/logger");

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
      logger.info(`Item Updated: ${id}`);

      return res.status(200).json({
        status: "ok"
      });

    } else {
      throw new Error("Data is missing.");
    }
  } catch (error) {
    console.error(error);
    logger.error(`Fail Item Updated: ${id}`);
    return res.status(400).json({
      message: "Ups hubo un error!",
      error: JSON.stringify(error)
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
  updateItem,
  deleteFileById
};
