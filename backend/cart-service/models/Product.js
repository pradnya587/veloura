const mongoose = require("mongoose");

// NOTE: The cart-service does not own product data — the product-service does.
// This model exists only so the cart-service can look up a product's price,
// name and image (from the SAME shared MongoDB database) when an item is
// added to the cart. It must stay schema-compatible with product-service's
// Product model.
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

module.exports = mongoose.model("Product", productSchema);
