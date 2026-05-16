import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

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

  const fetchCandidates = async () => {

    try {

      const response = await axios.get(
        "http://localhost:5000/api/candidates"
      );

      setCandidates(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const addCandidate = async () => {

    try {

      await axios.post(
        "http://localhost:5000/api/candidates",
        {
          ...formData,
          skills: formData.skills.split(","),
        }
      );

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

      console.log(error);

      alert("Error adding candidate");
    }
  };

  const matchCandidates = async () => {

    try {

      const response = await axios.post(
        "http://localhost:5000/api/match",
        {
          requiredSkills: requiredSkills.split(","),
          minExperience,
        }
      );

      setMatchedCandidates(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  const aiShortlist = async () => {

    try {

      const response = await axios.post(
        "http://localhost:5000/api/ai/shortlist",
        {
          requiredSkills: requiredSkills.split(","),
          minExperience,
        }
      );

      const result = response.data.rankedCandidates
        .map(
          (candidate) =>
            `
Name: ${candidate.name}

Match Score: ${candidate.matchScore}%

Recommendation: ${candidate.recommendation}

Skills: ${candidate.skills.join(", ")}

Experience: ${candidate.experience} years
`
        )
        .join("\n-------------------\n");

      setAiResult(result);

    } catch (error) {

      console.log(error);

      alert("AI Shortlisting Failed");
    }
  };

 return (

<div className="container">

  <h1 className="title">
    AI Candidate Shortlisting System
  </h1>

  <div className="section">

```
<h2>Add Candidate</h2>

<input
  className="input"
  type="text"
  name="name"
  placeholder="Enter Name"
  value={formData.name}
  onChange={handleChange}
/>

<input
  className="input"
  type="email"
  name="email"
  placeholder="Enter Email"
  value={formData.email}
  onChange={handleChange}
/>

<input
  className="input"
  type="text"
  name="skills"
  placeholder="Enter Skills"
  value={formData.skills}
  onChange={handleChange}
/>

<input
  className="input"
  type="number"
  name="experience"
  placeholder="Experience"
  value={formData.experience}
  onChange={handleChange}
/>

<textarea
  className="textarea"
  name="bio"
  placeholder="Enter Bio"
  value={formData.bio}
  onChange={handleChange}
/>

<br /><br />

<button className="button" onClick={addCandidate}>
  Add Candidate
</button>
```

  </div>

  <div className="section">

```
<h2>Job Requirements</h2>

<input
  className="input"
  type="text"
  placeholder="Required Skills"
  value={requiredSkills}
  onChange={(e) =>
    setRequiredSkills(e.target.value)
  }
/>

<input
  className="input"
  type="number"
  placeholder="Minimum Experience"
  value={minExperience}
  onChange={(e) =>
    setMinExperience(e.target.value)
  }
/>

<button className="button" onClick={matchCandidates}>
  Match Candidates
</button>

<button className="button" onClick={aiShortlist}>
  AI Shortlist
</button>
```

  </div>

  <div className="section">

```
<h2>Matched Candidates</h2>

<div className="card-grid">

  {
    matchedCandidates.map((candidate, index) => (

      <div className="card" key={index}>

        <h3>{candidate.name}</h3>

        <p className="score">
          Match Score: {candidate.matchScore}%
        </p>

        <p>
          <strong>Skills:</strong>
          {" "}
          {candidate.skills.join(", ")}
        </p>

        <p>
          <strong>Experience:</strong>
          {" "}
          {candidate.experience} years
        </p>

      </div>
    ))
  }

</div>
```

  </div>

  <div className="section">

```
<h2>AI Recommendation</h2>

<div className="ai-box">
  {aiResult}
</div>
```

  </div>

  <div className="section">

```
<h2>All Candidates</h2>

<div className="card-grid">

  {
    candidates.map((candidate) => (

      <div className="card" key={candidate._id}>

        <h3>{candidate.name}</h3>

        <p>
          <strong>Email:</strong>
          {" "}
          {candidate.email}
        </p>

        <p>
          <strong>Skills:</strong>
          {" "}
          {candidate.skills.join(", ")}
        </p>

        <p>
          <strong>Experience:</strong>
          {" "}
          {candidate.experience} years
        </p>

        <p>{candidate.bio}</p>

      </div>
    ))
  }

</div>
```

  </div>

</div>

);

}

export default App;