import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import UserModel from './models/UserModel.js';
import bcrypt from 'bcrypt';
import PostModel from './models/Posts.js';
 
const app = express();
app.use(cors());
app.use(express.json());
 

try {
    const conStr = "";
    await mongoose.connect(conStr);
    console.log(" Database Connected..");
} catch (error) {
    console.log(" Database connection error: " + error);
}
 

app.listen(5000, () => {
    console.log("Server running on port 5000");
});
 

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
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
 

app.post("/register", async (req, res) => {
    try {
        const { uname, email, password, profilepic } = req.body;
 
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
 
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({
            uname,
            email,
            password: hashedPassword,
            profilepic,
        });
 
        await newUser.save();
 
        res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.post("/savePost", async (req, res) => {
    try {
        const { postMsg, email, lat, lng } = req.body;
        const new_post = new PostModel({
            postMsg:postMsg,
            email,
            lat: lat,
            lng:lng,
        });
        await new_post.save();
 
        res.status(200).json({ message: "success" });
        
 
        
    } catch (error) {
        res.send(error);
        
    }
});

app.get("/getPosts", async (req, res) => {
    try {
        const postsWithUser=await PostModel.aggregate([
            {
                $lookup:{
                    from:"users",
                    localField:"email",
                    foreignField:"email",
                    as:"user"
                }
            },
            {$sort:{createdAt:-1}
        }
        ]);
        res.json({posts:postsWithUser});
    }catch (error) {
        res.send(error);
    }
});