const express = require("express");
const cors = require("cors");

const sessionRoutes = require("./routes/sessionRoutes");
const alarmRoutes = require("./routes/alarmRoutes");
const siteRoutes = require("./routes/siteRoutes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart Alarm backend is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is healthy"
  });
});

app.use("/api/session", sessionRoutes);
app.use("/api/alarm", alarmRoutes);
app.use("/api/sites", siteRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});