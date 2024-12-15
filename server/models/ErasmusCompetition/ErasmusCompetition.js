const mongoose = require("mongoose");

const erasmusCompetitionSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        role: {
            type: String,
            required: true,
            enum: ["student", "professor"],
        },
        institutionType: {
            type: String,
            required: true,
            enum: ["company", "college"],
        },
    },
    { timestamps: true }
);

const ErasmusCompetition = mongoose.model("ErasmusCompetition", erasmusCompetitionSchema);

module.exports = ErasmusCompetition;