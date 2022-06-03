const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  {
    networkEnv: {
      type: String
    },
    blockHash: {
      type: String
    },
    blockNumber: {
      type: Number
    },
    cumulativeGasUsed: {
      type: Number
    },
    effectiveGasPrice: {
      type: Number
    },
    from: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    transactionHash: {
      type: String,
      required: true
    },
    transactionIndex: {
      type: String,
      required: true
    }
  },
);

/**
 * FIXME: It should reply
 * items: [{
      type: Schema.Types.ObjectId,
      ref: 'Item'
    }],
 */
const orderSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
    },
    items: [{
      type: Object
    }],
    dateOrder: {
      type: Date,
      default: Date.now,
    },
    userBuyer: {
      type: String,
      required: true
    },
    transactionHash: {
      type: String,
    },
    status: {
      type: String
    }
  },
);

const Order = mongoose.model('Order', orderSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = {
  Order,
  Transaction
};
