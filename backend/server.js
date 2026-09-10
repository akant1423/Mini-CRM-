const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const leadRoutes = require("./routes/leadRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/leads", leadRoutes);

// Test route
app.get("/", (req, res) => {
    res.send("Mini CRM Backend is Running!");
});

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.log("MongoDB Connection Error:", error.message);
    });

// Start server
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});