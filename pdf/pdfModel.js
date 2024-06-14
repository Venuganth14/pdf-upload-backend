const mongoose = require("mongoose");

const PdfSchema = new mongoose.Schema({
  title: String,
  pdf: String,
});

mongoose.model("PdfDetails", PdfSchema);

module.exports = mongoose.model("PdfDetails");
