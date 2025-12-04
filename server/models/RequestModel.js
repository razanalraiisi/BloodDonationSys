import mongoose from "mongoose";

const RequestSchema = mongoose.Schema({
    userEmail: String,
    patientName: String,
    bloodType: String,
    hospital: String,
    urgency: String,
    neededDate: String,
    status: { type: String, default: "Pending" }
});

const RequestModel = mongoose.model("Requests", RequestSchema, "Requests");
export default RequestModel;
