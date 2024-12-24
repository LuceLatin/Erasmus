//create post route for erasmusApplication

import {checkAuthorization} from "../jwt.js";
import express from "express";
import {ErasmusApplication} from "../models/ErasmusCompetition/Application.js";
import mongoose from "mongoose";
export const erasmusApplicationRouter = express.Router();

erasmusApplicationRouter.post("/api/erasmus-application", checkAuthorization, async (req, res) => {
    try {
         console.log(req.body);
        const erasmusApplicationBody = {
            user: req.body.user._id,
            erasmusCompetition: req.body.competitionData._id,
        }
        const newApplication = new ErasmusApplication(erasmusApplicationBody);
        await newApplication.save();
        res.status(201).json(newApplication);
    } catch (error) {
        console.error("Error creating application:", error);
        res.status(500).json({ error: "Failed to create application" });
    }
});
