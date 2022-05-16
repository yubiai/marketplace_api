const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const itemSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  pictures: {
    type: Array,
    required: true,
  },
  seller: {
    type: String,
    trim: true,
  },
  maxorders: {
    type: Number,
    required: true,
    default: 1,
  },
  status: {
    type: String,
    default: "review",
  },
  slug: {
    type: String,
    unique: true,
    slug: "title",
  },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  subcategories: {
    type: Array,
  }

});

const Item = mongoose.model("Item", itemSchema);

module.exports = {
  Item,
};
