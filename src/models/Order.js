const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePagination = require("mongoose-paginate-v2");

const transactionMetaSchema = new Schema(
  {
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
    transactionHash: {
      type: String,
      required: true
    },
    contractAddressURI: {
      type: String,
    }
  }
);

const transactionSchema = new Schema(
  {
    transactionState: {
      type: Number
    },
    claimCount: {
      type: Number,
      default: 0
    },
    timeForService: {
      type: Number
    },
    timeForClaim: {
      type: Number
    },
    currentClaim: {
      type: Number
    },
    transactionMeta: {
      type: transactionMetaSchema
    },
    networkEnv: {
      type: String
    },
    from: {
      type: String,
      required: true
    },
    to: {
      type: String,
      required: true
    },
    transactionIndex: {
      type: String,
      required: true
    },
    transactionPayedAmount: {
      type: String,
      default: ''
    },
    transactionFeeAmount: {
      type: String,
      default: ''
    },
    transactionDate: {
      type: Number,
      default: 0
    },
    disputeId: {
      type: Number,
      default: 0
    }
  },
);

const orderSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
    },
    itemId: {
      type: Schema.Types.ObjectId
    },
    dateOrder: {
      type: Date,
      default: Date.now,
    },
    userBuyer: {
      type: String,
      required: true
    },
    userSeller: {
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
  {
    versionKey: false,
    timestamps: true,
  }
);

orderSchema.plugin(mongoosePagination)

const Order = mongoose.model('Order', orderSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = {
  Order,
  Transaction
};
