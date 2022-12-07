const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true
    },
    itemId: {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true
    },
    question: {
      type: String,
      required: true
    },
    response: {
      type: String
    },
    dateresponse: {
      type: Date
    },
    status: {
      type: Number,
      default: 0,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Question = mongoose.model("Question", questionSchema);

module.exports = {
  Question
};
