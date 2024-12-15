const mongoose = require("mongoose");

const erasmusApplicationSchema = new mongoose.Schema(
    {
        applicationDate: {
            type: Date,
            required: true,
            default: Date.now,
        },
        status: {
            type: String,
            required: true,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        erasmusCompetition: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ErasmusCompetition",
            required: true,
        },
        files: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "File",
            },
        ],
    },
    { timestamps: true }
);

const ErasmusApplication = mongoose.model("ErasmusApplication", erasmusApplicationSchema);

module.exports = ErasmusApplication;