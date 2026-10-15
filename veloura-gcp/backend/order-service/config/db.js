const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("MONGODB_URI is not set in your .env file");
    }

    await mongoose.connect(uri);
    console.log("[order-service] MongoDB Atlas connected:", mongoose.connection.host);
  } catch (err) {
    console.error("[order-service] MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
