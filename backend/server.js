const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/candidates", require("./routes/candidateRoutes"));
app.use("/api", require("./routes/matchRoutes"));
app.use("/api", require("./routes/aiRoutes"));

app.get("/", (req, res) => {
  res.send("API Running");
});

// MongoDB Connect
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");

    app.listen(process.env.PORT, () => {
        console.log(`Server running on port ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.log(err);
});
//app.use("/api", require("./routes/aiRoutes"));