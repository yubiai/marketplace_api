const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const msgFeedbackSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
},
{
  versionKey: false,
  timestamps: true,
});


const MsgFeedback = mongoose.model("MsgFeedback", msgFeedbackSchema);

module.exports = {
  MsgFeedback
};
