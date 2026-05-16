const router = require("express").Router();

const {
    addCandidate,
    getCandidates
} = require("../controllers/candidateController");

router.post("/", addCandidate);

router.get("/", getCandidates);

module.exports = router;