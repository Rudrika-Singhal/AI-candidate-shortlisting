const express = require("express");
const router = express.Router();
const { matchCandidates } = require("../controllers/matchController");

router.post("/match", matchCandidates);

module.exports = router;