const express = require("express");
const shortid = require("shortid");
const Url = require("../models/Url");

const router = express.Router();

router.post("/shorten", async (req, res) => {
  try {
    let { originalUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ message: "URL is required" });
    }

    // Add https:// if missing
    if (!originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")) {
      originalUrl = "https://" + originalUrl;
    }

    const shortId = shortid.generate();

    const newUrl = new Url({
      originalUrl,
      shortId
    });

    await newUrl.save();

    res.json({
      shortUrl: `${process.env.BASE_URL}/${shortId}`
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// Redirect to Original URL
router.get("/:shortId", async (req, res) => {
  try {
    const { shortId } = req.params;

    const url = await Url.findOne({ shortId });

    if (url) {
      url.clicks++;
      await url.save();
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json({ message: "URL not found" });
    }

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
