import mongoose from "mongoose";

const DonationCenterSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true, trim: true },
  contact: { type: String, required: true, trim: true },
  openingHours: { type: String, required: true, default: "24/7" },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  type: { type: String, enum: ["Hospital", "Donation Center"], required: true }
});

const DonationCenterModel = mongoose.model("Centers", DonationCenterSchema, "Centers");
export default DonationCenterModel;
