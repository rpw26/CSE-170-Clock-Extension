const store = require("../data/store");
const { generateMathChallenge } = require("../services/challengeService");
const {
  updateSessionPhase,
  isTemporarilyUnlocked
} = require("../services/sessionService");

function triggerAlarm(req, res) {
  const challenge = generateMathChallenge();

  store.session.alarmActive = true;
  store.session.currentPhase = "alarm";
  store.session.challengeQuestion = challenge.question;
  store.session.challengeAnswer = challenge.answer;
  store.session.unlockUntil = null;

  return res.json({
    success: true,
    message: "Alarm triggered",
    data: {
      alarmActive: true,
      challengeQuestion: store.session.challengeQuestion
    }
  });
}

function getAlarmStatus(req, res) {
  updateSessionPhase();

  return res.json({
    success: true,
    data: {
      alarmActive: store.session.alarmActive,
      currentPhase: store.session.currentPhase,
      challengeQuestion: store.session.challengeQuestion,
      temporarilyUnlocked: isTemporarilyUnlocked(),
      unlockUntil: store.session.unlockUntil
    }
  });
}

function completeAlarm(req, res) {
  const { answer } = req.body;

  if (!store.session.alarmActive) {
    return res.status(400).json({
      success: false,
      message: "No active alarm"
    });
  }

  if (String(answer).trim() !== String(store.session.challengeAnswer).trim()) {
    return res.status(400).json({
      success: false,
      message: "Wrong answer"
    });
  }

  store.session.alarmActive = false;
  store.session.challengeQuestion = null;
  store.session.challengeAnswer = null;

  if (store.session.active) {
    store.session.currentPhase = "study";
  } else {
    store.session.currentPhase = "idle";
  }

  store.session.unlockUntil = Date.now() + 60 * 1000;

  return res.json({
    success: true,
    message: "Alarm completed. User is temporarily unlocked for 1 minute.",
    data: {
      unlockUntil: store.session.unlockUntil
    }
  });
}

module.exports = {
  triggerAlarm,
  getAlarmStatus,
  completeAlarm
};