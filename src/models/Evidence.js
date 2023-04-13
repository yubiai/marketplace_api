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
    type: Number,
    required: true,
    default: 0
  },
  dealId: {
    type: String
  },
  claimID: {
    type: String
  },
  value_to_claim: {
    type: Number,
    required: true
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
  messages: {
    type: Array,
    default: []
  },
  files: {
    type: Array,
    default: []
  },
  url_ipfs_pdf: {
    type: String,
    required: true
  },
  url_ipfs_json: {
    type: String,
    required: true
  },
},
  {
    versionKey: false,
    timestamps: true
  })

const Evidence = mongoose.model('Evidence', evidenceSchema)

module.exports = {
  Evidence
}
