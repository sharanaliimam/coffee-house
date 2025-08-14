const mongoose = require('mongoose');

const coffeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  origin: { type: String },
  roastLevel: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  description: { type: String },
  image: { type: String }, // URL of coffee image
  category: { type: String }, // e.g., "Latte", "Espresso"
  
  // ✅ Add this status field
  status: {
    type: String,
    enum: ["Available", "Sold Out"],
    default: "Available"
  }

}, { timestamps: true });

module.exports = mongoose.model('Coffee', coffeeSchema);
