const Candidate = require("../models/Candidate");

const aiShortlist = async (req, res) => {

  try {

    const requiredSkills =
      req.body.requiredSkills || [];

    const candidates = await Candidate.find();

    const rankedCandidates = candidates.map((candidate) => {

      const matchedSkills = candidate.skills.filter((skill) =>
        requiredSkills.includes(skill)
      );

      const score =
        requiredSkills.length > 0
          ? (matchedSkills.length / requiredSkills.length) * 100
          : 0;

      return {
        name: candidate.name,
        skills: candidate.skills,
        experience: candidate.experience,
        matchScore: score.toFixed(2),

        recommendation:
          score >= 70
            ? "Highly Recommended"
            : score >= 40
            ? "Recommended"
            : "Less Suitable",
      };
    });

    rankedCandidates.sort(
      (a, b) => b.matchScore - a.matchScore
    );

    res.json({
      message: "AI Shortlisting Success",
      rankedCandidates,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "AI Shortlisting Failed",
    });
  }
};

module.exports = { aiShortlist };