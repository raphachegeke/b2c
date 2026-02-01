import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  phone: String,
  amount: Number,
  status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"], default: "PENDING" },
  response: Object,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Transaction", transactionSchema);

