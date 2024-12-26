import mongoose from "mongoose";
const fileSchema = new mongoose.Schema(
    {
        application: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ErasmusApplication",
            required: true,
        },
        filename: {
            type: String,
            required: true,
        },
        fileId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

export const File = mongoose.model("File", fileSchema);