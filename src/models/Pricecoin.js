const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const priceCoinSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  symbol: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  token_address: {
    type: String,
  },
  protocol: {
    type: String
  },
  last_updated_at: {
    type: Date
  }
},
  {
    versionKey: false,
    timestamps: true,
  });

const PriceCoin = mongoose.model("PriceCoin", priceCoinSchema);

module.exports = {
  PriceCoin
};