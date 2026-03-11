const express = require("express");
const {
  triggerAlarm,
  getAlarmStatus,
  completeAlarm
} = require("../controllers/alarmController");

const router = express.Router();

router.get("/status", getAlarmStatus);
router.post("/trigger", triggerAlarm);
router.post("/complete", completeAlarm);

module.exports = router;