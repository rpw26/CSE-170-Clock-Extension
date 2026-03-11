const express = require("express");
const cors = require("cors");
const sessionRoutes = require("./routes/sessionRoutes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart Alarm timer backend is running"
  });
});

app.use("/api/timer", sessionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});