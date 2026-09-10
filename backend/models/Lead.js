const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            required: true
        },

        message: {
            type: String,
            required: true
        },

        source: {
            type: String,
            default: "Website"
        },

        status: {
            type: String,
            enum: ["new", "contacted", "converted", "lost"],
            default: "new"
        },

        notes: {
            type: String,
            default: ""
        }
    },

    {
        timestamps: true
    }
);

const Lead = mongoose.model("Lead", leadSchema);

module.exports = Lead;