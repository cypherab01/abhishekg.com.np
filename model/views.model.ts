import mongoose from "mongoose";

const viewSchema = new mongoose.Schema({
  views: { type: Number, default: 0 },
});

const View = mongoose.models.View || mongoose.model("View", viewSchema);

export default View;
