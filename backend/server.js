const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
const apiRoutes = require("./routes/urlRoutes");
app.use("/api", apiRoutes); // for POST /api/shorten

// Redirect Route (short URL)
app.use("/", apiRoutes); // handles GET /:shortId for redirect

// Serve frontend
app.use(express.static(path.join(__dirname, "../frontend")));

// Catch-all for SPA (non-API requests)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("Mongo Error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
