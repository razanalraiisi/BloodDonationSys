import mongoose from "mongoose";

const EligibilityTermSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    category: { type: String, default: "General" },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const EligibilityTerm = mongoose.model("EligibilityTerm", EligibilityTermSchema);
export default EligibilityTerm;
