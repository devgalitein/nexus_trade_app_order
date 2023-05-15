const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    code: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Company = mongoose.model("Company", schema);

module.exports = Company;
