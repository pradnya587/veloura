const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Cart data lives in cart-service (its own DB on its own VM),
// so the order-service reads and clears it over the internal network.
const CART_SERVICE_URL = process.env.CART_SERVICE_URL || "http://localhost:5002";

// POST /api/orders  { cartId, customer: {...} }
// Turns the current cart into an order (the "Buy" action) and empties the cart.
router.post("/", async (req, res) => {
  try {
    const { cartId, customer } = req.body;
    const cartRes = await fetch(`${CART_SERVICE_URL}/api/cart/${encodeURIComponent(cartId)}`);
    const cart = cartRes.ok ? await cartRes.json() : null;

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      cartId,
      items: cart.items,
      customer,
      totalAmount,
    });

    await fetch(`${CART_SERVICE_URL}/api/cart/${encodeURIComponent(cartId)}/clear`, {
      method: "DELETE",
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to place order", error: err.message });
  }
});

// GET /api/orders/:id
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order", error: err.message });
  }
});

// GET /api/orders/cart/:cartId  (order history for this browser's cartId)
router.get("/cart/:cartId", async (req, res) => {
  try {
    const orders = await Order.find({ cartId: req.params.cartId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
});

module.exports = router;
