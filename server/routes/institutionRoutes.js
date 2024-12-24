import express from "express";
import { checkAuthorization, validateToken, checkAuthorization2 } from "../jwt.js";
import {Institution} from "../models/Institution/Institution.js";

const institutionRouter = express.Router();

institutionRouter.post("/api/institutions", checkAuthorization, async (req, res) => {
    try {
        const newInstitution = new Institution(req.body);
        await newInstitution.save();
        res.status(201).json(newInstitution);
    } catch (error) {
        console.error("Error creating institution:", error);
        res.status(500).json({ error: "Failed to create institution" });
    }
});

institutionRouter.get("/api/institutions", validateToken, checkAuthorization2(['koordinator', 'student', 'profesor']), async (req, res) => {
    try {
        const institutions = await Institution.find();
        res.json(institutions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch institutions.' });
    }
});

institutionRouter.get("/api/institutions/:id", validateToken, checkAuthorization2(['koordinator', 'student', 'profesor']), async (req, res) => {
    try {
        const institution = await Institution.findById(req.params.id);
        if (!institution) {
            return res.status(404).json({ error: "Institution not found" });
        }
        res.status(200).json(institution);
    } catch (error) {
        console.error("Error fetching institution:", error);
        res.status(500).json({ error: "Failed to fetch institution" });
    }
});

institutionRouter.put("/api/institutions/:id", checkAuthorization, async (req, res) => {
    try {
        const updatedInstitution = await Institution.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedInstitution) {
            return res.status(404).json({ error: "Institution not found" });
        }
        res.status(200).json(updatedInstitution);
    } catch (error) {
        console.error("Error updating institution:", error);
        res.status(500).json({ error: "Failed to update institution" });
    }
});

institutionRouter.delete("/api/institutions/:id", checkAuthorization, async (req, res) => {
    try {
        const deletedInstitution = await Institution.findByIdAndDelete(req.params.id);
        if (!deletedInstitution) {
            return res.status(404).json({ error: "Institution not found" });
        }
        res.status(200).json({ message: "Institution deleted successfully" });
    } catch (error) {
        console.error("Error deleting institution:", error);
        res.status(500).json({ error: "Failed to delete institution" });
    }
});

export default institutionRouter;