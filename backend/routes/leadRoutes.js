const express = require("express");
const Lead = require("../models/Lead");

const router = express.Router();

// Create a new lead
router.post("/", async (req, res) => {
    try {
        const lead = new Lead(req.body);

        const savedLead = await lead.save();

        res.status(201).json(savedLead);
    } catch (error) {
        console.log("ERROR CREATING LEAD:", error);

        res.status(500).json({
            message: "Error creating lead",
            error: error.message
        });
    }
});

// Get all leads
router.get("/", async (req, res) => {
    try {
        const leads = await Lead.find().sort({ createdAt: -1 });

        res.json(leads);
    } catch (error) {
        console.log("ERROR FETCHING LEADS:", error);

        res.status(500).json({
            message: "Error fetching leads",
            error: error.message
        });
    }
});

// Update lead status and notes
router.put("/:id", async (req, res) => {
    try {
        const updatedLead = await Lead.findByIdAndUpdate(
            req.params.id,
            {
                status: req.body.status,
                notes: req.body.notes
            },
            { new: true }
        );

        res.json(updatedLead);
    } catch (error) {
        console.log("ERROR UPDATING LEAD:", error);

        res.status(500).json({
            message: "Error updating lead",
            error: error.message
        });
    }
});

// Delete a lead
router.delete("/:id", async (req, res) => {
    try {
        await Lead.findByIdAndDelete(req.params.id);

        res.json({
            message: "Lead deleted successfully"
        });
    } catch (error) {
        console.log("ERROR DELETING LEAD:", error);

        res.status(500).json({
            message: "Error deleting lead",
            error: error.message
        });
    }
});

module.exports = router;