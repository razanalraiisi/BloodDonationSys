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
    medicalNotes: {
        type: [
            new mongoose.Schema({
                _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
                text: { type: String, required: true },
                createdAt: { type: Date, default: Date.now }
            }, { _id: false })
        ],
        default: []
    },
    

    isAdmin: { type: Boolean, default: false }
});

const UserModel = mongoose.model("Users", UserSchema, "Users");
export default UserModel;
