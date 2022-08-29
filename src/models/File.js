const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const fileSchema = new Schema(
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
    title: {
      type: String,
      default: ""
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const File = mongoose.model("File", fileSchema);

module.exports = {
  File
};
