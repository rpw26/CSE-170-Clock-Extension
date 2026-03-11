const express = require("express");
const {
  getSession,
  startSession,
  stopSession,
  getTimeLeft
} = require("../controllers/sessionController");

const router = express.Router();

router.get("/", getSession);
router.get("/time-left", getTimeLeft);
router.post("/start", startSession);
router.post("/stop", stopSession);

module.exports = router;