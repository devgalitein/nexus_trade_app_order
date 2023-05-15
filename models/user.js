const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    userId: { type: String, required: true },
    accessToken: { type: String, default: "" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User = mongoose.model("User", schema);

module.exports = User;
