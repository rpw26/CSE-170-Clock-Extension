const store = require("../data/store");
const {
  syncTimer,
  startTimer,
  stopTimer,
  pauseTimer,
  resumeTimer,
  resetTimer
} = require("../services/sessionService");

function getTimer(req, res) {
  syncTimer();

  return res.json({
    success: true,
    data: store.timer
  });
}

function handleStartTimer(req, res) {
  try {
    const { mode = "pomodoro", customMinutes = null } = req.body;

    const timer = startTimer(mode, customMinutes);

    return res.json({
      success: true,
      message: "Timer started",
      data: timer
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

function handleStopTimer(req, res) {
  const timer = stopTimer();

  return res.json({
    success: true,
    message: "Timer stopped",
    data: timer
  });
}

function handlePauseTimer(req, res) {
  try {
    const timer = pauseTimer();

    return res.json({
      success: true,
      message: "Timer paused",
      data: timer
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

function handleResumeTimer(req, res) {
  try {
    const timer = resumeTimer();

    return res.json({
      success: true,
      message: "Timer resumed",
      data: timer
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

function handleResetTimer(req, res) {
  const timer = resetTimer();

  return res.json({
    success: true,
    message: "Timer reset",
    data: timer
  });
}

module.exports = {
  getTimer,
  handleStartTimer,
  handleStopTimer,
  handlePauseTimer,
  handleResumeTimer,
  handleResetTimer
};