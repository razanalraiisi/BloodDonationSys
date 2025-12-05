import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import UserModel from "./models/UserModel.js";
import RequestModel from "./models/RequestModel.js";
import DonationCenterModel from "./models/DonationCenterModel.js";
import DonationModel from "./models/DonationModel.js";

const app = express();
app.use(cors());
app.use(express.json());

// ----------------------------------
// 1) CONNECT TO MONGODB ATLAS
// ----------------------------------
try {
    const conStr = "mongodb+srv://admin:admin@cluster0.luc5pu9.mongodb.net/?appName=Cluster0";
    await mongoose.connect(conStr);
    console.log("Database Connected...");
} catch (error) {
    console.log("Database connection error: " + error);
}

// ----------------------------------
// USER REGISTER
// ----------------------------------
app.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, bloodType, dob, city, medicalHistory, gender } = req.body;

    // Basic validation
    if (!fullName || !email || !password || !bloodType || !dob || !city || !gender) {
      return res.status(400).json({ message: "Please provide all required fields." });
    }

    const existing = await UserModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      fullName,
      email,
      password: hashed,
      bloodType,
      dob,
      city,
      medicalHistory: medicalHistory || "",
      gender
    });

    await newUser.save();
    res.status(200).json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ----------------------------------
// USER LOGIN
// ----------------------------------
app.post("/login", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const pwd_match = await bcrypt.compare(req.body.password, user.password);
    if (!pwd_match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ user, message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});


// ----------------------------------
// GET USER PROFILE
// ----------------------------------
// PROFILE (post with email)
app.post("/profile", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});



// ----------------------------------
// UPDATE PROFILE
// ----------------------------------
app.post("/updateProfile", async (req, res) => {
  try {
    const {
      email,
      fullName,
      city,
      bloodType,
      medicalHistory,
      dob,
      gender
    } = req.body;

    await UserModel.updateOne(
      { email },
      { $set: { fullName, city, bloodType, medicalHistory, dob, gender } }
    );

    res.status(200).json({ message: "Profile updated" });

  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
});


// ======================================================
// BLOOD REQUEST — CREATE
// ======================================================
app.post("/request/create", async (req, res) => {
    try {
        const newRequest = new RequestModel({
            userEmail: req.body.userEmail,
            patientName: req.body.patientName,
            bloodType: req.body.bloodType,
            hospital: req.body.hospital,
            urgency: req.body.urgency,
            neededDate: req.body.neededDate,
        });

        await newRequest.save();

        res.json({ message: "Request created successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ======================================================
// USER — VIEW OWN REQUESTS
// ======================================================
app.post("/request/mine", async (req, res) => {
    const { email } = req.body;

    const myRequests = await RequestModel.find({ userEmail: email });
    res.json(myRequests);
});

// ======================================================
// ADMIN — VIEW ALL REQUESTS
// ======================================================
app.get("/request/all", async (req, res) => {
    const allRequests = await RequestModel.find();
    res.json(allRequests);
});

// ======================================================
// ADMIN — APPROVE REQUEST
// ======================================================
app.post("/request/approve", async (req, res) => {
    const { id } = req.body;

    await RequestModel.findByIdAndUpdate(id, { status: "Approved" });

    res.json({ message: "Request Approved" });
});

// ======================================================
// ADMIN — REJECT REQUEST
// ======================================================
app.post("/request/reject", async (req, res) => {
    const { id } = req.body;

    await RequestModel.findByIdAndUpdate(id, { status: "Rejected" });

    res.json({ message: "Request Rejected" });
});

// ======================================================
// DONATION CENTERS (ADMIN CRUD)
// ======================================================
app.post("/center/add", async (req, res) => {
    try {
        const newCenter = new DonationCenterModel(req.body);
        await newCenter.save();
        res.json({ message: "Center added" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// GET all donation centers
app.get("/api/donation-centers", async (req, res) => {
  try {
    const centers = await DonationCenterModel.find();
    res.json(centers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ======================================================
// DONATION — CREATE
// ======================================================
app.post("/donation/create", async (req, res) => {
  try {
    console.log("/donation/create payload:", req.body);
    const {
      donorEmail,
      donorName,
      bloodType,
      donationType,
      hospitalLocation,
      feelingWell,
      healthChanges,
      medication,
      chronicIllness,
      traveledRecent,
    } = req.body;

    if (!donorEmail || !bloodType || !donationType || !feelingWell || !healthChanges || !medication || !chronicIllness) {
      return res.status(400).json({ message: "Missing required fields", received: { donorEmail, bloodType, donationType, feelingWell, healthChanges, medication, chronicIllness } });
    }

    const donation = new DonationModel({
      donorEmail,
      donorName,
      bloodType,
      donationType,
      hospitalLocation,
      feelingWell,
      healthChanges,
      medication,
      chronicIllness,
      traveledRecent,
    });

    const saved = await donation.save();
    console.log("Donation saved with id:", saved._id);
    res.status(200).json({ message: "Donation submitted", donationId: saved._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// ======================================================
// DONATION — MINE (by donorEmail)
// ======================================================
app.post("/donation/mine", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });
    const mine = await DonationModel.find({ donorEmail: email }).sort({ createdAt: -1 });
    res.status(200).json(mine);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
