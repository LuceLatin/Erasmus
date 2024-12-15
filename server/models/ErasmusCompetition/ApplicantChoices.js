const mongoose = require("mongoose");

const applicantChoicesSchema = new mongoose.Schema(
    {
        application: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ErasmusApplication",
            required: true,
        },
        branch: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch",
            required: true,
        },
        choice: {
            type: String,
            required: true,
            enum: ["first", "second", "third"],
        },
        status: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
);

const ApplicantChoices = mongoose.model("ApplicantChoices", applicantChoicesSchema);

module.exports = ApplicantChoices;