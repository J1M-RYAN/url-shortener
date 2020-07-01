const mongoose = require("mongoose");
const linkSchema = new mongoose.Schema({
  fullUrl: String,
  shortUrl: String,
});

module.exports = linkSchema;
