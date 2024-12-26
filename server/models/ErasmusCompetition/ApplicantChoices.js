import mongoose from "mongoose";

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
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        }
    },
    { timestamps: true }
);

export const ApplicantChoices = mongoose.model("ApplicantChoices", applicantChoicesSchema);
