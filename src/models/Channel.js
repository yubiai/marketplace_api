const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const channelSchema = new Schema(
  {
    order_id: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true
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
    status: {
      type: Boolean,
      default: true,
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

const Channel = mongoose.model("Channel", channelSchema);

module.exports = {
  Channel
};
