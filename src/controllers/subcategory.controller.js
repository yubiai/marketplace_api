const { Subcategory } = require('../models/Subcategory');

async function getSubCategories(req, res) {
  try {
    const subcategories = await Subcategory.find({})

    res.status(200).json({
      status: 'ok',
      result: subcategories,
    })
  } catch (error) {
    res.status(400).json({
      message: 'Ups Hubo un error!',
      error: error,
    })
  }
}

// New Sub Category
async function postSubCategory(req, res) {
  try {
    const item = new Subcategory({
      title: req.body.title,
      description: req.body.description,
      createdBy: req.body.createdBy
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
}

module.exports = {
  getSubCategories,
  postSubCategory
}
