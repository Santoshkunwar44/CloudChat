const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
    city: {
      type: String,
    },
    followers: {
      type: Array,
      default: [],
    },
    gender: {
      type: String,
      max: 15,
    },
    followings: {
      type: Array,
      default: [],
    },
    profilePicture: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      require,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("User", userSchema);
