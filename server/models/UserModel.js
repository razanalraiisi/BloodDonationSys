import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },

    bloodType: { type: String, required: true },
    dob: { type: String, required: true },
    city: { type: String, required: true },
    gender: { type: String, required: true },

    medicalHistory: { type: String, default: "" },
    

    isAdmin: { type: Boolean, default: false }
});

const UserModel = mongoose.model("Users", UserSchema, "Users");
export default UserModel;
