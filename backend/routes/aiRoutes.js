const express = require("express");

const router = express.Router();

const {
  aiShortlist,
} = require("../controllers/aiController");

router.post("/ai/shortlist", aiShortlist);

module.exports = router;