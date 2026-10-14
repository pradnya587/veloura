require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const cartRoutes = require("./routes/cart");

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Veloura Cart Service is running" });
});

app.use("/api/cart", cartRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Veloura Cart Service listening on port ${PORT}`);
});
