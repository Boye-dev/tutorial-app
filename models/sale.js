const mongoose = require("mongoose");
const { Schema } = mongoose;

const SaleSchema = new Schema(
  {
    product: {
      type: mongoose.Schema.Types.Mixed,
    },
    quantitySold: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    total: {
      type: Number,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

let Sale = mongoose.model("sale", SaleSchema);

module.exports = Sale;
