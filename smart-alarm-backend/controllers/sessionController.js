const store = require("../data/store");
const {
  updateSessionPhase,
  getTimeLeftMs
} = require("../services/sessionService");

function getSession(req, res) {
  updateSessionPhase();

  return res.json({
    success: true,
    data: {
      ...store.session,
      timeLeftMs: getTimeLeftMs()
    }
  });
}

function startSession(req, res) {
  const {
    studyMinutes = 45,
    breakMinutes = 5,
    finalStudyMinutes = 10,
    blockedSites = [
      "youtube.com",
      "www.youtube.com",
      "instagram.com",
      "www.instagram.com",
      "tiktok.com",
      "www.tiktok.com"
    ]
  } = req.body;

  if (
    typeof studyMinutes !== "number" ||
    typeof breakMinutes !== "number" ||
    typeof finalStudyMinutes !== "number"
  ) {
    return res.status(400).json({
      success: false,
      message: "Session times must be numbers"
    });
  }

  if (studyMinutes <= 0 || breakMinutes < 0 || finalStudyMinutes < 0) {
    return res.status(400).json({
      success: false,
      message: "Session times must be valid positive values"
    });
  }

  const now = Date.now();

  store.session = {
    active: true,
    currentPhase: "study",
    studyMinutes,
    breakMinutes,
    finalStudyMinutes,
    startedAt: now,
    phaseStartedAt: now,
    blockedSites: Array.isArray(blockedSites) ? blockedSites : [],
    alarmActive: false,
    challengeQuestion: null,
    challengeAnswer: null,
    unlockUntil: null
  };

  return res.json({
    success: true,
    message: "Session started",
    data: store.session
  });
}

function stopSession(req, res) {
  store.session = {
    ...store.session,
    active: false,
    currentPhase: "idle",
    startedAt: null,
    phaseStartedAt: null,
    alarmActive: false,
    challengeQuestion: null,
    challengeAnswer: null,
    unlockUntil: null
  };

  return res.json({
    success: true,
    message: "Session stopped",
    data: store.session
  });
}

function getTimeLeft(req, res) {
  updateSessionPhase();

  return res.json({
    success: true,
    data: {
      currentPhase: store.session.currentPhase,
      timeLeftMs: getTimeLeftMs()
    }
  });
}

module.exports = {
  getSession,
  startSession,
  stopSession,
  getTimeLeft
};