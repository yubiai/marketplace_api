const mongoose = require('mongoose')
const Schema = mongoose.Schema
const slug = require('mongoose-slug-updater')

mongoose.plugin(slug)

const subcategorySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    required: true,
    default: false
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category"
  },
  slug: {
    type: String,
    unique: true,
    slug: "title",
  },
  items: [{
    type: Schema.Types.ObjectId,
    ref: "Item"
  }],
  en: {
    type: String,
    required: true
  },
  es: {
    type: String,
    required: true
  },
},
  {
    versionKey: false,
    timestamps: true
  })

const Subcategory = mongoose.model('Subcategory', subcategorySchema)

module.exports = {
  Subcategory,
}
