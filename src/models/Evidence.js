const mongoose = require('mongoose')
const Schema = mongoose.Schema

const evidenceSchema = new Schema({
  order_id: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true
  },
  transactionHash: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    default: "initial"
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
    required: true
  },
  author_address: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  files: {
    type: Array,
    required: true,
    default: []
  }
},
  {
    versionKey: false,
    timestamps: true
  })

const Evidence = mongoose.model('Evidence', evidenceSchema)

module.exports = {
  Evidence
}
