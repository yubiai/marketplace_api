const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePagination = require("mongoose-paginate-v2");

const notificationSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "Profile",
      required: true
    },
    type: {
      type: String,
      required: true
    },
    reference: {
      type: String,
      required: true
    },
    seen: {
      type: Boolean,
      default: false
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

notificationSchema.plugin(mongoosePagination)

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = {
  Notification
};
