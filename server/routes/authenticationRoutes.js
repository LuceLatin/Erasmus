import express from "express";
import { User } from "../models/User/User.js";
import bcrypt from "bcryptjs";
import { createTokens, validateToken, checkAuthorization } from "../jwt.js";

const authenticationRouter = express.Router();

authenticationRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Check if user is already logged in
    

    User.findOne({ email: email }).then((user) => {
        if (!user) {
            res.status(404).json({ message: "User not found." });
        } else {
            const dbPassword = user.password;
            bcrypt.compare(password, dbPassword).then((match) => {
                if (!match) {
                    res.status(401).json({
                        message: "Wrong Username and Password Combination!",
                    });
                } else {
                    const accessToken = createTokens(user);
                    res.cookie("access-token", accessToken, {
                        maxAge: 60 * 60 * 24 * 1000,
                    });
                    res.status(200).json({
                        message: "Logged in successfully.",
                    });
                }
            });
        }
    });
});

authenticationRouter.post("/logout", (req, res) => {
    console.log("abc")
    
    res.clearCookie("access-token");


    res.status(200).json({ message: "Logged out successfully." });
});


export default authenticationRouter;
