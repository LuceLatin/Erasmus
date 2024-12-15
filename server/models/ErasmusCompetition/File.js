const mongoose = require("mongoose");

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
        filePath: {
            type: String,
            required: true,
        },
        uploadedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const File = mongoose.model("File", fileSchema);

module.exports = File;