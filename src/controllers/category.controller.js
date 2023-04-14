const { Category } = require("../models/Category");

async function getCategory(req, res) {
  try {
    const categories = await Category.find({}).populate("items");

    return res.status(200).json(categories);
  } catch (error) {
    console.error(error)
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

/* async function postCategory(req, res) {
  try {
    const item = new Category({
      title: req.body.title,
      description: req.body.description,
      createdBy: req.body.createdBy,
    });

    await item.save();

    return res.status(200).json({
      message: "Categoria agregado con éxito!",
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
} */

async function getCategoryId(req, res) {
  try {
    const categories = await Category.findById({ _id: req.params.id }).populate(
      "items"
    );
    return res.status(200).json({
      status: "ok",
      response: categories,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

async function getCategoryBySlug(req, res) {
  try {
    const slug = req.params.slug;
    if (!slug) {
      return res.status(400).json({
        message: "Not Slug"
      });
    }
    const category = await Category.findOne({ slug: slug });
    return res.status(200).json({
      status: "ok",
      result: category
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

module.exports = {
  getCategory,
  /* postCategory, */
  getCategoryId,
  getCategoryBySlug
};
