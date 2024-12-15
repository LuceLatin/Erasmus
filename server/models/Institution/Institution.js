const mongoose = require("mongoose");

const institutionSchema = new mongoose.Schema(
    {
        OIB: {
            type: Number,
            required: true,
            validate: {
                validator: function (v) {
                    return v.toString().length === 11;
                },
                message: "OIB must be exactly 11 digits long.",
            },
        },
        name: {
            type: String,
            required: true,
            unique: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ["company", "college"],
        },
    },
    { timestamps: true }
);

const Institution = mongoose.model("Institution", institutionSchema);

module.exports = Institution;