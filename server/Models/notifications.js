const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema(
  {
    messages: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    users: {
      type: Array,
    },
    typeOf: {
      type: String,
      default: "message",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("notification", notificationSchema);
