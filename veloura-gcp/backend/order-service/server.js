require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const orderRoutes = require("./routes/orders");

const app = express();

connectDB();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Veloura Order Service is running" });
});

app.use("/api/orders", orderRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Veloura Order Service listening on port ${PORT}`);
});
