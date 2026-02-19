const mongoose = require("mongoose");

const UrlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true
  },
  shortId: {
    type: String,
    required: true
  },
  clicks: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model("Url", UrlSchema);
