import mongoose from "mongoose";

const RequestSchema = mongoose.Schema({
  userEmail: { type: String, required: true },        // Logged-in user making the request
  patientName: { type: String, required: true },      // Patient full name
  patientId: { type: String, default: "" },
  hospitalFileNumber: { type: String, default: "" },
  relationship: { type: String, default: "" },        // Only if mode === "other"

  bloodType: { type: String, required: true },
  bloodUnits: { type: Number, default: 0 },

  reason: { type: String, default: "" },

  hospital: { type: String, required: true },
  urgency: { type: String, default: "Normal" },

  neededDate: { type: String, required: true },

  medicalReportPath: { type: String, default: "" },

  mode: { type: String, enum: ["self", "other"], required: true },

  status: { type: String, default: "Pending" },
});

const RequestModel = mongoose.model("Requests", RequestSchema);

export default RequestModel;
