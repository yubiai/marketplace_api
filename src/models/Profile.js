const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const privateInfoSchema = new Schema(
  {
    realname: {
      type: String,
      trim: true,
      default: ""
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
    }
  }
);

const profileSchema = new Schema(
  {
    eth_address: {
      type: String,
      required: true,
      trim: true,
    },
    poh_info: {
      type: Object
    },
    lens_info: {
      type: Object
    },
    sequence_info: {
      type: Object
    },
    private_info: {
      type: privateInfoSchema
    },
    permission: {
      type: Number,
      default: 1
    },
    name: {
      type: String,
      trim: true
    },
    photo: {
      type: String,
      trim: true
    },
    notes: {
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
    }],
    terms: {
      type: Array,
      default: []
    },
    disputespolicy: {
      type: Array,
      default: []
    }
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
