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
    author: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  })

const Terms = mongoose.model('Terms', termsSchema)

module.exports = {
  Terms
}
