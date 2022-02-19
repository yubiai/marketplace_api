const { Category } = require('../models/Category');
const { Item }=require('../models/Item');

async function getCategory(req, res) {
  try {
    const categories = await Category.find({}).populate('items')

    res.status(200).json({
      status: 'ok',
      result: categories,
    })
  } catch (error) {
    res.status(400).json({
      message: 'Ups Hubo un error!',
      error: error,
    })
  }
}

async function postCategory(req, res) {
  try {
    const item = new Category({
      categoryId: req.body.categoryId,
      title: req.body.title,
      description: req.body.description,
      permalink: req.body.permalink,
    })

    await item.save()

    res.status(200).json({
      message: 'Categoria agregado con éxito!',
    })
  } catch (error) {
    console.log(error)
    res.status(400).json({
      message: 'Ups Hubo un error!',
      error: error,
    })
  }
}

async function getCategoryId(req, res) {
  try {
    const categories = await Category.findById({_id: req.params.id}).populate("items")
    res.status(200).json({
      status: 'ok',
      response: categories
    })
  } catch (error) {
    res.status(400).json({
      message: 'Ups Hubo un error!',
      error: error,
    })
  }
}

module.exports = {
  getCategory,
  postCategory,
  getCategoryId,
}
