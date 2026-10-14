const mongoose = require("mongoose");

// NOTE: The order-service does not own cart data — the cart-service does.
// This model exists only so the order-service can read the shopper's cart
// (from the SAME shared MongoDB database) and empty it once an order is
// placed. It must stay schema-compatible with cart-service's Cart model.
const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: String,
    price: Number,
    image: String,
    size: { type: String, default: "M" },
    quantity: { type: Number, required: true, min: 1, default: 1 },
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    cartId: { type: String, required: true, unique: true, index: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
