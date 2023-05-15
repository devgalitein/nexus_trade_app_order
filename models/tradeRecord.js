const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    opening: { type: Number, required: true },
    closing: { type: Number, required: true },
    avgRate: { type: Number, required: true },
    companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const TradeRecord = mongoose.model("TradeRecord", schema);

module.exports = TradeRecord;
