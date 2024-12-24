import express from "express";
import { User } from "../models/User/User.js";
import bcrypt from "bcryptjs";
import { createTokens, validateToken, checkAuthorization } from "../jwt.js";


const userRouter = express.Router();

// Get all users
userRouter.get("/api/users", checkAuthorization, async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

userRouter.post("/api/users/add", async (req, res) => {
    try {
        const { email, username } = req.body;

        // Check if email or username already exists in the database
        const existingUser = await User.findOne({
            $or: [{ email: email }, { username: username }],
        });

        if (existingUser) {
            return res.status(400).json({
                error: "Email or Username already exists. Please choose a different one.",
            });
        }

        const newUser = new User(req.body);
        newUser.password = bcrypt.hashSync(newUser.password, 10);

        newUser.branch = newUser._id;

        await newUser.save();

        res.status(201).json({ message: "User successfully created", user: newUser });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ error: "Failed to add user" });
    }
});


export default userRouter;
