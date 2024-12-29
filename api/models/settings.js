const mongoose = require("mongoose");

const AnonymizationSettingsScheme = new mongoose.Schema({
  fileId: { type: mongoose.Types.ObjectId, required: true, unique: true },
  settings: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
  "AnonymizationSettings",
  AnonymizationSettingsScheme
);
