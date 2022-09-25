const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const filevidenceSchema = new Schema(
  {
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    mimetype: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true
    },
    order_id: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Filevidence = mongoose.model("Filevidence", filevidenceSchema);

module.exports = {
  Filevidence
};
