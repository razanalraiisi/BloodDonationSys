import mongoose from "mongoose";

const DonationSchema = mongoose.Schema({
  donorEmail: { type: String, required: true },
  donorName: { type: String, required: true },
  bloodType: { type: String, required: true },
  donationType: { type: String, required: true },
  hospitalLocation: { type: String, default: "" },

  feelingWell: { type: String, required: true }, // Yes/No
  healthChanges: { type: String, required: true }, // Yes/No
  medication: { type: String, required: true }, // Yes/No
  chronicIllness: { type: String, required: true }, // Yes/No
  traveledRecent: { type: String, default: "" }, // Yes/No/empty

  status: { type: String, default: "Submitted" },
  createdAt: { type: Date, default: Date.now },
});

const DonationModel = mongoose.model("Donations", DonationSchema, "Donations");
export default DonationModel;
