const { Subcategory } = require('../models/Subcategory');

async function getSubCategories(req, res) {
  try {
    const categoryId = req.params.categoryId;
    const subcategories = await Subcategory.find({
      category: categoryId
    })
    return res.status(200).json(subcategories)
  } catch (error) {
    return res.status(400).json({
      message: 'Ups Hubo un error!',
      error: error,
    })
  }
}

// Sub Categories
async function getSubCategoryId(req, res) {
  try {
    const subCategory = await Subcategory.findById(req.params.id)

    return res.status(200).json({
      status: "ok",
      response: subCategory
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      message: "Ups Hubo un error!",
      error: error,
    });
  }
}

// New Sub Category
/* async function postSubCategory(req, res) {
  try {
    const item = new Subcategory({
      title: req.body.title,
      description: req.body.description,
      createdBy: req.body.createdBy,
      category: req.body.category
    })

    await item.save()

    res.status(200).json({
      message: 'Sub Category agregado con éxito!',
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: 'Ups Hubo un error!',
      error: error,
    })
  }
} */

module.exports = {
  getSubCategories,
  /* postSubCategory, */
  getSubCategoryId
}
