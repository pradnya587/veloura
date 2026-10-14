// Run with: npm run seed
// Populates your MongoDB Atlas "veloura" database with sample products.

require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");

const products = [
  {
    name: "Cloud Cotton Oversized Tee",
    description: "Heavyweight combed cotton tee with a relaxed, boxy fit.",
    price: 29.99,
    category: "Unisex",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Sand"],
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
    stock: 120,
    rating: 4.6,
  },
  {
    name: "Ridge Wool Overcoat",
    description: "Tailored double-breasted overcoat in brushed wool blend.",
    price: 189.0,
    category: "Men",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Charcoal", "Camel"],
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600",
    stock: 40,
    rating: 4.8,
  },
  {
    name: "Linen Wrap Midi Dress",
    description: "Breathable linen dress with an adjustable waist wrap.",
    price: 74.5,
    category: "Women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Olive", "Ivory"],
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600",
    stock: 65,
    rating: 4.7,
  },
  {
    name: "Featherlight Down Vest",
    description: "Packable insulated vest for layering in cold weather.",
    price: 98.0,
    category: "Unisex",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Forest Green"],
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
    stock: 55,
    rating: 4.4,
  },
  {
    name: "Straight Fit Selvedge Denim",
    description: "Rigid selvedge denim jeans, straight cut through the leg.",
    price: 118.0,
    category: "Men",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Indigo"],
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600",
    stock: 80,
    rating: 4.5,
  },
  {
    name: "Ribbed Knit Bodysuit",
    description: "Second-skin ribbed bodysuit with a scoop neckline.",
    price: 39.0,
    category: "Women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Chocolate", "Cream"],
    image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600",
    stock: 90,
    rating: 4.3,
  },
  {
    name: "Trail Canvas Sneakers",
    description: "Low-top canvas sneakers with a reinforced rubber sole.",
    price: 64.0,
    category: "Footwear",
    sizes: ["7", "8", "9", "10", "11", "12"],
    colors: ["White", "Off-Black"],
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600",
    stock: 100,
    rating: 4.6,
  },
  {
    name: "Structured Leather Belt",
    description: "Full-grain leather belt with a brushed brass buckle.",
    price: 45.0,
    category: "Accessories",
    sizes: ["S/M", "L/XL"],
    colors: ["Brown", "Black"],
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
    stock: 70,
    rating: 4.5,
  },
  {
    name: "Merino Crewneck Sweater",
    description: "Fine-gauge merino wool sweater, breathable and lightweight.",
    price: 89.0,
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy", "Grey Marl", "Burgundy"],
    image: "https://images.unsplash.com/photo-1616849104358-4d09cf3a1b5f?w=600",
    stock: 60,
    rating: 4.7,
  },
  {
    name: "Pleated Wide-Leg Trousers",
    description: "High-rise wide-leg trousers with a fluid drape.",
    price: 82.0,
    category: "Women",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Taupe"],
    image: "https://images.unsplash.com/photo-1509551388413-e18d0ac5d495?w=600",
    stock: 50,
    rating: 4.4,
  },
  {
    name: "Quilted Zip Bomber",
    description: "Cropped bomber jacket with quilted lining and rib trims.",
    price: 134.0,
    category: "Unisex",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Rust"],
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
    stock: 45,
    rating: 4.6,
  },
  {
    name: "Everyday Crossbody Bag",
    description: "Compact vegan-leather crossbody with adjustable strap.",
    price: 52.0,
    category: "Accessories",
    sizes: ["One Size"],
    colors: ["Black", "Tan"],
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600",
    stock: 85,
    rating: 4.5,
  },
];

(async () => {
  await connectDB();
  try {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products into Veloura's catalog.`);
  } catch (err) {
    console.error("Seeding failed:", err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
})();
