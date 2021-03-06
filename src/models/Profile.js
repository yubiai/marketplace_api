const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema(
  {
    eth_address: {
      type: String,
      required: true,
      trim: true,
    },
    registered_time: {
      type: String,
      required: true,
      trim: true
    },
    realname: {
      type: String,
      trim: true
    },
    first_name: {
      type: String,
      trim: true,
    },
    last_name: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true,
      default: ""
    },
    country: {
      type: String,
      trim: true,
      default: ""
    },
    city: {
      type: String,
      trim: true,
      default: ""
    },
    telephone: {
      type: String,
      default: ""
    },
    email: {
      type: String,
      trim: true,
      default: ""
    },
    permission: {
      type: Number,
      default: 1
    },
    photo: {
      type: String, 
      trim: true
    },
    items: [{
      type: Schema.Types.ObjectId,
      ref: "Item"
    }],
    favorites: [{
      type: Schema.Types.ObjectId,
      ref: "Item"
    }]
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Profile = mongoose.model("Profile", profileSchema);

module.exports = {
  Profile,
};
