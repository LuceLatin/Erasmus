import express from "express";
import { User } from "../models/User/User.js";

const userRouter = express.Router();

// Get all users
userRouter.get("/api/users", async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// Add a new user
userRouter.post("/api/users/add", async (req, res) => {
    try {

        // Create new user instance
        const newUser = new User(req.body);

        // Save the new user to the database
        await newUser.save();

        res.status(201).json({ message: "User successfully created", user: newUser });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ error: "Failed to add user" });
    }
});

export default userRouter;
