const express = require("express");
const {
  getTimer,
  handleStartTimer,
  handleStopTimer,
  handlePauseTimer,
  handleResumeTimer,
  handleResetTimer
} = require("../controllers/sessionController");

const router = express.Router();

router.get("/", getTimer);
router.post("/start", handleStartTimer);
router.post("/stop", handleStopTimer);
router.post("/pause", handlePauseTimer);
router.post("/resume", handleResumeTimer);
router.post("/reset", handleResetTimer);

module.exports = router;