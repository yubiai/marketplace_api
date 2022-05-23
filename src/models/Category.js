const mongoose = require('mongoose')
const Schema = mongoose.Schema
const slug = require('mongoose-slug-updater')

mongoose.plugin(slug)

const categorySchema = new Schema({
  title: String,
  description: String,
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

const Category = mongoose.model('Category', categorySchema)

module.exports = {
  Category,
}
