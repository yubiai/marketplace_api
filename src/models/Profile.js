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

const badgesInfoSchema = new Schema(
  {
    protocol: {
      type: String,
      trim: true
    },
    status: {
      type: Boolean
    },
    dateOfVerification: {
      type: Date
    },
    dateDue: {
      type: Date
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const rewardsSchema = new Schema(
  {
    reward: {
      type: Number,
      default: false
    },
    hash: {
      type: String,
      trim: true
    },
    date: {
      type: Date
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
)

const profileSchema = new Schema(
  {
    eth_address: {
      type: String,
      required: true,
      trim: true,
    },
    private_info: {
      type: privateInfoSchema
    },
    badges: {
      type: [badgesInfoSchema]
    },
    rewards: {
      type: [rewardsSchema]
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
