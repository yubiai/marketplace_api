const mongoose = require('mongoose')
const Schema = mongoose.Schema

const termsSchema = new Schema({
    text: {
      type: String,
      required: true
    },
    last: {
      type: Boolean,
      required: true,
      default: false
    },
    published: {
      type: Boolean,
      required: true,
      default: false
    },
    createdBy: {
      type: String,
      required: true
    },
    updateBy: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      required: true
    },
    updateAt: {
      type: Date,
      required: true
    },
  },
  {
    versionKey: false,
    timestamps: true
  })

const Terms = mongoose.model('Terms', termsSchema)

module.exports = {
  Terms
}
