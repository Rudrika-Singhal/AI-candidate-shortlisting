import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = "https://ai-backend-pwr6.onrender.com";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    skills: "",
    experience: "",
    bio: "",
  });

  const [candidates, setCandidates] = useState([]);
  const [requiredSkills, setRequiredSkills] = useState("");
  const [minExperience, setMinExperience] = useState("");
  const [matchedCandidates, setMatchedCandidates] = useState([]);
  const [aiResult, setAiResult] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ GET ALL CANDIDATES (FIXED ROUTE)
  const fetchCandidates = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/candidates`);
      setCandidates(res.data);
    } catch (error) {
      console.log("Fetch error:", error.message);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // ✅ ADD CANDIDATE (FIXED ROUTE)
  const addCandidate = async () => {
    try {
      await axios.post(`${API_BASE}/api/candidates`, {
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim()),
        experience: Number(formData.experience),
      });

      alert("Candidate Added Successfully");

      setFormData({
        name: "",
        email: "",
        skills: "",
        experience: "",
        bio: "",
      });

      fetchCandidates();
    } catch (error) {
      console.log("Add error:", error.message);
      alert("Error adding candidate");
    }
  };

  // ✅ MATCH CANDIDATES
  const matchCandidates = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/match`, {
        requiredSkills: requiredSkills.split(",").map((s) => s.trim()),
        minExperience: Number(minExperience),
      });

      setMatchedCandidates(res.data);
    } catch (error) {
      console.log("Match error:", error.message);
    }
  };

  // ✅ AI SHORTLIST
  const aiShortlist = async () => {
    try {
      const res = await axios.post(`${API_BASE}/api/ai/shortlist`, {
        requiredSkills: requiredSkills.split(",").map((s) => s.trim()),
        minExperience: Number(minExperience),
      });

      const result = res.data.rankedCandidates
        .map(
          (c) => `
Name: ${c.name}
Match Score: ${c.matchScore}%
Recommendation: ${c.recommendation}
Skills: ${c.skills.join(", ")}
Experience: ${c.experience} years
`
        )
        .join("\n-----------------\n");

      setAiResult(result);
    } catch (error) {
      console.log("AI error:", error.message);
      alert("AI Shortlisting Failed");
    }
  };

  return (
    <div className="container">
      <h1>AI Candidate Shortlisting System</h1>

      {/* ADD CANDIDATE */}
      <div className="section">
        <h2>Add Candidate</h2>

        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
        <input name="skills" value={formData.skills} onChange={handleChange} placeholder="Skills (comma separated)" />
        <input name="experience" value={formData.experience} onChange={handleChange} placeholder="Experience" />
        <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" />

        <button onClick={addCandidate}>Add Candidate</button>
      </div>

      {/* JOB REQUIREMENTS */}
      <div className="section">
        <h2>Job Requirements</h2>

        <input
          value={requiredSkills}
          onChange={(e) => setRequiredSkills(e.target.value)}
          placeholder="Required Skills"
        />

        <input
          value={minExperience}
          onChange={(e) => setMinExperience(e.target.value)}
          placeholder="Min Experience"
        />

        <button onClick={matchCandidates}>Match</button>
        <button onClick={aiShortlist}>AI Shortlist</button>
      </div>

      {/* MATCHED */}
      <div className="section">
        <h2>Matched Candidates</h2>

        {matchedCandidates.map((c, i) => (
          <div key={i} className="card">
            <h3>{c.name}</h3>
            <p>Score: {c.matchScore}%</p>
            <p>{c.skills?.join(", ")}</p>
          </div>
        ))}
      </div>

      {/* AI RESULT */}
      <div className="section">
        <h2>AI Result</h2>
        <pre>{aiResult}</pre>
      </div>

      {/* ALL CANDIDATES */}
      <div className="section">
        <h2>All Candidates</h2>

        {candidates.map((c) => (
          <div key={c._id} className="card">
            <h3>{c.name}</h3>
            <p>{c.email}</p>
            <p>{c.skills?.join(", ")}</p>
            <p>{c.experience} years</p>
            <p>{c.bio}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;