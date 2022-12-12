const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePagination = require("mongoose-paginate-v2");

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
      required: true,
      trim: true
    },
    answer: {
      type: String,
      trim: true
    },
    dateanswer: {
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

questionSchema.plugin(mongoosePagination)

const Question = mongoose.model("Question", questionSchema);

module.exports = {
  Question
};
