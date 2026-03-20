const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: Number, required: true },
  shopName: { type: String, default: "" },
  accountType: { type: String, enum: ["shopkeeper", "user"], default: "shopkeeper" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  customers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Customer", default: [] }],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
