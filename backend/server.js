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

// Routes
const urlRoutes = require("./routes/urlRoutes");
app.use("/api", urlRoutes); // API prefixed with /api

// Serve frontend static files
const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));

// Catch-all for frontend routes
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    setTimeout(connectDB, 5000);
  }
};
connectDB();

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
