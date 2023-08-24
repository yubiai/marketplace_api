const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePagination = require("mongoose-paginate-v2");

const channelSchema = new Schema(
  {
    order_id: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      default: null
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true
    },
    item_id: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true
    },
    status: {
      type: Boolean,
      default: true,
    },
    priceconfig: {
      type: Number
    },
    time_for_service: {
      type: Number
    },
    time_for_claim: {
      type: Number
    },
    typeprice: {
      type: String
    },
    messages: [
      {
        date: Date,
        user: {
          type: Schema.Types.ObjectId,
          ref: "Profile",
          required: true
        },
        user_eth_address: {
          type: String,
          required: true
        },
        text: {
          type: String,
          required: true
        },
        file: {
          type: Schema.Types.ObjectId,
          ref: "Filevidence"
        }
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

channelSchema.plugin(mongoosePagination)

const Channel = mongoose.model("Channel", channelSchema);

module.exports = {
  Channel
};
