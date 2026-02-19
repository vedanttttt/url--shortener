const express = require("express");
const router = express.Router();
const Url = require("../models/Url");
const shortid = require("shortid");

// Create short URL
router.post("/shorten", async (req, res) => {
  try {
    let { originalUrl } = req.body;

    // Add protocol if missing
    if (!originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")) {
      originalUrl = "https://" + originalUrl;
    }

    const shortId = shortid.generate(); // generate unique ID
    const newUrl = new Url({ originalUrl, shortId });
    await newUrl.save();

    // Remove accidental double slashes
    const base = process.env.BASE_URL.replace(/\/+$/, "");
    res.json({ shortUrl: `${base}/${shortId}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Redirect short URL (outside /api)
router.get("/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;
    const urlData = await Url.findOne({ shortId });

    if (!urlData) {
      return res.status(404).json({ message: "URL not found" });
    }

    // Ensure protocol exists
    let destination = urlData.originalUrl;
    if (!/^https?:\/\//i.test(destination)) {
      destination = "https://" + destination;
    }

    return res.redirect(destination);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
