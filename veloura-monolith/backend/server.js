require("dotenv").config();
const path = require("path");
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const productRoutes = require("./routes/products");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orders");

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());

// ---------- API (same paths the microservices exposed via the gateway) ----------
app.get("/api/health", (req, res) => {
  res.json({ message: "Veloura monolith is running" });
});

app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

// Unknown /api routes -> JSON 404
app.use("/api", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ---------- Frontend (built React app, copied to ./public by the Dockerfile) ----------
const publicDir = path.join(__dirname, "public");
if (fs.existsSync(path.join(publicDir, "index.html"))) {
  app.use(express.static(publicDir));
  // Single-page-app fallback: any non-API GET returns index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({ message: "Veloura monolith API is running (no frontend build found)" });
  });
  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Veloura monolith listening on port ${PORT}`);
});
