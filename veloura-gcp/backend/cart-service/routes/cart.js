const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// Product data lives in product-service (its own DB on its own VM),
// so the cart-service asks it over the internal network.
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || "http://localhost:5001";
async function fetchProduct(id) {
  const r = await fetch(`${PRODUCT_SERVICE_URL}/api/products/${encodeURIComponent(id)}`);
  if (!r.ok) return null;
  return r.json();
}

// Helper: fetch or create a cart by cartId
async function getOrCreateCart(cartId) {
  let cart = await Cart.findOne({ cartId });
  if (!cart) cart = await Cart.create({ cartId, items: [] });
  return cart;
}

// GET /api/cart/:cartId
router.get("/:cartId", async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.params.cartId);
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart", error: err.message });
  }
});

// POST /api/cart/:cartId/add  { productId, size, quantity }
router.post("/:cartId/add", async (req, res) => {
  try {
    const { productId, size = "M", quantity = 1 } = req.body;
    const product = await fetchProduct(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const cart = await getOrCreateCart(req.params.cartId);
    const existing = cart.items.find(
      (item) => item.product.toString() === productId && item.size === size
    );

    if (existing) {
      existing.quantity += Number(quantity);
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        size,
        quantity,
      });
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to add item to cart", error: err.message });
  }
});

// PUT /api/cart/:cartId/update  { itemId, quantity }
router.put("/:cartId/update", async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    const cart = await getOrCreateCart(req.params.cartId);
    const item = cart.items.id(itemId);
    if (!item) return res.status(404).json({ message: "Item not found in cart" });

    if (quantity <= 0) {
      item.deleteOne();
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to update cart", error: err.message });
  }
});

// DELETE /api/cart/:cartId/remove/:itemId
router.delete("/:cartId/remove/:itemId", async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.params.cartId);
    const item = cart.items.id(req.params.itemId);
    if (item) item.deleteOne();
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item", error: err.message });
  }
});

// DELETE /api/cart/:cartId/clear
router.delete("/:cartId/clear", async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.params.cartId);
    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "Failed to clear cart", error: err.message });
  }
});

module.exports = router;
