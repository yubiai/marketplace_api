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

module.exports = {
  getSubCategories
}
