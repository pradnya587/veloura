require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));

app.get("/", (req, res) => {
  res.json({ message: "Veloura API Gateway is running" });
});

// Service locations. Override these in .env when deploying each service
// to its own host/container.
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || "http://localhost:5001";
const CART_SERVICE_URL = process.env.CART_SERVICE_URL || "http://localhost:5002";
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || "http://localhost:5003";

// The frontend keeps calling /api/products, /api/cart, /api/orders exactly
// as before — the gateway is the only thing that knows these now live on
// separate services.
app.use(
  "/api/products",
  createProxyMiddleware({ target: PRODUCT_SERVICE_URL, changeOrigin: true })
);

app.use(
  "/api/cart",
  createProxyMiddleware({ target: CART_SERVICE_URL, changeOrigin: true })
);

app.use(
  "/api/orders",
  createProxyMiddleware({ target: ORDER_SERVICE_URL, changeOrigin: true })
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Veloura API Gateway listening on port ${PORT}`);
  console.log(`  -> /api/products  => ${PRODUCT_SERVICE_URL}`);
  console.log(`  -> /api/cart      => ${CART_SERVICE_URL}`);
  console.log(`  -> /api/orders    => ${ORDER_SERVICE_URL}`);
});
