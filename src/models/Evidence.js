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
  text: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
    required: true
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
