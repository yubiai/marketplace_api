const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const channelSchema = new Schema(
  {
    order_id: {
      type: String,
      required: true,
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
        text: String
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
