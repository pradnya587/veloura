const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Men", "Women", "Unisex", "Accessories", "Footwear"],
    },
    sizes: { type: [String], default: ["S", "M", "L", "XL"] },
    colors: { type: [String], default: [] },
    image: { type: String, required: true },
    stock: { type: Number, default: 50, min: 0 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
  },
  { timestamps: true }
);

// Text index so we can run $text search across name/description/category
productSchema.index({ name: "text", description: "text", category: "text" });

module.exports = mongoose.model("Product", productSchema);
