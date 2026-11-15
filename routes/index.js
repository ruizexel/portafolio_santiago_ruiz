"use strict";

const express = require("express");
const path = require("path");

const router = express.Router();
const ROOT = path.join(__dirname, "..");

router.get(["/", "/index.html"], (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(path.join(ROOT, "index.html"));
});

module.exports = router;
