const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-updater");
const mongoosePagination = require("mongoose-paginate-v2");

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
  currencySymbolPrice: {
    type: String,
    required: true
  },
  ubiburningamount: {
    type: Number,
    required: true
  },
  files: {
    type: Array,
    required: true,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
    required: true
  },
  maxorders: {
    type: Number,
    required: true,
    default: 1,
  },
  status: {
    type: Number,
    default: 0,
  },
  published: {
    type: Boolean,
    default: false
  },
  publishedDate: {
    type: Date,
    default: null
  },
  slug: {
    type: String,
    unique: true,
    slug: "title",
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  subcategory: {
    type: Schema.Types.ObjectId,
    ref: "Subcategory",
    required: true
  }
},
{
  versionKey: false,
  timestamps: true,
});

itemSchema.plugin(mongoosePagination)

const Item = mongoose.model("Item", itemSchema);

module.exports = {
  Item,
};
