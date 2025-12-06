import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import multer from "multer";
import fs from "fs";

import UserModel from "./models/UserModel.js";
import RequestModel from "./models/RequestModel.js";
import DonationCenterModel from "./models/DonationCenterModel.js";
import DonationModel from "./models/DonationModel.js";
import EligibilityTerm from "./models/EligibilityTerm.js";

const app = express();
app.use(cors());
app.use(express.json());

// ensure uploads folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// serve uploaded files (medical reports)
app.use("/uploads", express.static("uploads"));

// ----------------------------------
// 1) CONNECT TO MONGODB ATLAS
// ----------------------------------
try {
  const conStr =
    "mongodb+srv://admin:admin@cluster0.luc5pu9.mongodb.net/?appName=Cluster0";
  await mongoose.connect(conStr);
  console.log("Database Connected...");
} catch (error) {
  console.log("Database connection error: " + error);
}

// ----------------------------------
// MULTER SETUP FOR MEDICAL REPORT UPLOADS
// ----------------------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder is guaranteed above
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ----------------------------------
// USER REGISTER
// ----------------------------------
app.post("/register", async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      bloodType,
      dob,
      city,
      medicalHistory,
      gender,
    } = req.body;

    if (
      !fullName ||
      !email ||
      !password ||
      !bloodType ||
      !dob ||
      !city ||
      !gender
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
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
      gender,
    });

    await newUser.save();
    res
      .status(200)
      .json({ message: "User registered successfully", user: newUser });
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
app.post("/profile", async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) return res.status(404).json({ message: "User not found" });

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
      gender,
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
// BLOOD REQUEST — CREATE (WITH FILE UPLOAD)
// ======================================================
app.post(
  "/request/create",
  upload.single("medicalReport"),
  async (req, res) => {
    try {
      const {
        userEmail,
        patientName,
        patientId,
        hospitalFileNumber,
        relationship,
        bloodType,
        bloodUnits,
        reason,
        hospital,
        urgency,
        neededDate,
        mode,
      } = req.body;

      if (!userEmail || !patientName || !bloodType || !hospital || !neededDate || !mode) {
        return res
          .status(400)
          .json({ message: "Missing required fields for request" });
      }

      const medicalReportPath = req.file ? req.file.path : "";

      const newRequest = new RequestModel({
        userEmail,
        patientName,
        patientId,
        hospitalFileNumber,
        relationship,
        bloodType,
        bloodUnits: bloodUnits ? Number(bloodUnits) : 0,
        reason,
        hospital,
        urgency,
        neededDate,
        medicalReportPath,
        mode,
      });

      await newRequest.save();

      res.status(200).json({ message: "Request created successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error creating request" });
    }
  }
);

// ======================================================
// DASHBOARD COUNTS
// ======================================================
let cachedLivesSaved = 0; // optimized counter

const initializeCachedLivesSaved = async () => {
  try {
    cachedLivesSaved = await RequestModel.countDocuments({ status: "Completed" });
  } catch (err) {
    console.error("Error initializing livesSaved cache:", err);
  }
};

initializeCachedLivesSaved();

app.get("/api/dashboard", async (req, res) => {
  try {
    // Active Donors: count unique donorEmail in Donations
    const activeDonors = await DonationModel.distinct("donorEmail").then(
      (emails) => emails.length
    );

    res.status(200).json({
      activeDonors,
      livesSaved: cachedLivesSaved,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});

// ======================================================
// UPDATE REQUEST STATUS (Optimized Lives Saved Counter)
// ======================================================
app.post("/request/updateStatus", async (req, res) => {
  try {
    const { id, status } = req.body;
    const request = await RequestModel.findById(id);
    if (!request) return res.status(404).json({ message: "Request not found" });

// ======================================================
// ELIGIBILITY TERMS — PUBLIC LIST
// ======================================================
app.get("/api/eligibility-terms", async (req, res) => {
  try {
    const terms = await EligibilityTerm.find({ active: true }).sort({ order: 1, createdAt: 1 });
    res.json(terms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching eligibility terms" });
  }
});

// ======================================================
// ELIGIBILITY TERMS — ADMIN CRUD (no auth yet)
// ======================================================
app.post("/api/eligibility-terms", async (req, res) => {
  try {
    const { title, description, category, order, active } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });
    const term = new EligibilityTerm({ title, description, category, order, active });
    await term.save();
    res.status(201).json(term);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating eligibility term" });
  }
});

app.put("/api/eligibility-terms/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, order, active } = req.body;
    const updated = await EligibilityTerm.findByIdAndUpdate(
      id,
      { $set: { title, description, category, order, active } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Term not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating term" });
  }
});

app.delete("/api/eligibility-terms/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const removed = await EligibilityTerm.findByIdAndDelete(id);
    if (!removed) return res.status(404).json({ message: "Term not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting term" });
  }
});
    const prevStatus = request.status;
    request.status = status;
    await request.save();

    // Increment cachedLivesSaved if status changed to Completed
    if (prevStatus !== "Completed" && status === "Completed") {
      cachedLivesSaved += 1;
    }

    res.json({ message: "Request status updated", livesSaved: cachedLivesSaved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating request status" });
  }
});



app.listen(5000, () => {
  console.log("Server running on port 5000");
});
