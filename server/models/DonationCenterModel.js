import mongoose from "mongoose";

const DonationCenterSchema = mongoose.Schema({
    name: String,
    city: String,
    contact: String
});

const DonationCenterModel = mongoose.model("Centers", DonationCenterSchema, "Centers");
export default DonationCenterModel;
