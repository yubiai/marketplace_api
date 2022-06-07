const mongoose = require('mongoose')
const Schema = mongoose.Schema
const slug = require('mongoose-slug-updater')

mongoose.plugin(slug)

const subcategorySchema = new Schema({
  title: String,
  status: {
    type: Boolean,
    default: true
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
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Profile"
  }
},
  {
    versionKey: false,
    timestamps: true
  })

const Subcategory = mongoose.model('Subcategory', subcategorySchema)

module.exports = {
  Subcategory,
}
