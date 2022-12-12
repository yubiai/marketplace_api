const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePagination = require("mongoose-paginate-v2");

const reportSchema = new Schema(
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
    },
    description: {
      type: String,
      required: true
    },
    motive: {
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

reportSchema.plugin(mongoosePagination)

const Report = mongoose.model("Report", reportSchema);

module.exports = {
  Report
};
