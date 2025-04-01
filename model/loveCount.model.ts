import mongoose from "mongoose";

const loveCountSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
});

export default mongoose.models.LoveCount ||
  mongoose.model("LoveCount", loveCountSchema);
