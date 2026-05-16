const Candidate = require("../models/Candidate");

exports.matchCandidates = async (req, res) => {

    try {

        const { requiredSkills, minExperience } = req.body;

        const candidates = await Candidate.find();

        const results = candidates.map(candidate => {

            const matchedSkills = candidate.skills.filter(skill =>
                requiredSkills.includes(skill)
            );

            const score =
                (matchedSkills.length / requiredSkills.length) * 100;

            let ranking = "Low";

            if (score >= 80) {
                ranking = "High";
            }
            else if (score >= 50) {
                ranking = "Medium";
            }

            return {
                name: candidate.name,
                email: candidate.email,
                skills: candidate.skills,
                experience: candidate.experience,
                matchedSkills,
                matchScore: score,
                ranking
            };

        }).filter(candidate =>
            candidate.experience >= minExperience
        );

        results.sort((a, b) =>
            b.matchScore - a.matchScore
        );

        res.json(results);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};