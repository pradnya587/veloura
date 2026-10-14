const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

// GET /api/products
// Supports: ?search=hoodie  ?category=Men  ?minPrice=10&maxPrice=100  ?sort=price_asc|price_desc|newest
router.get("/", async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, sort } = req.query;
    const filter = {};

    if (search) {
      // Simple, robust search across name/description/category
      // (works even without the $text index being built yet)
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { description: regex }, { category: regex }];
    }

    if (category) filter.category = category;

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let sortOption = { createdAt: -1 };
    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };

    const products = await Product.find(filter).sort(sortOption);
    res.json({ count: products.length, products });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product", error: err.message });
  }
});

// POST /api/products  (helper for adding products yourself, e.g. via Postman)
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: "Failed to create product", error: err.message });
  }
});

module.exports = router;
