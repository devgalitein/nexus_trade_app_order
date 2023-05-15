const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    avgRate: { type: Number, required: true },
    totalShare: { type: Number, required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Holding = mongoose.model("Holding", schema);

module.exports = Holding;
