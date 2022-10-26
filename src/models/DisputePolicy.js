const mongoose = require('mongoose')
const Schema = mongoose.Schema

const disputePolicySchema = new Schema({
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

const DisputesPolicy = mongoose.model('DisputesPolicy', disputePolicySchema)

module.exports = {
  DisputesPolicy
}
