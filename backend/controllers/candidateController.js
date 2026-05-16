const Candidate = require("../models/Candidate");

exports.addCandidate = async (req, res) => {

    try {

        const candidate = await Candidate.create(req.body);

        res.status(201).json(candidate);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

exports.getCandidates = async (req, res) => {

    try {

        const candidates = await Candidate.find();

        res.json(candidates);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};