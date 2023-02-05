const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: Number, required: true },
    sales: { type: Number, default: 0 },
    category: { type: String },
    mainImage: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.Mixed,
    },
    updatedBy: {
      type: mongoose.Schema.Types.Mixed,
    },
    mainImagePublicCloudinaryId: { type: String },
  },
  { timestamps: true }
);

let Product = mongoose.model("product", productSchema);

module.exports = Product;
