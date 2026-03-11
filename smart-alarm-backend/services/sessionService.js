const store = require("../data/store");

function getNow() {
  return Date.now();
}

function getPhaseDurationMs(phase, session) {
  if (phase === "study") {
    return session.studyMinutes * 60 * 1000;
  }

  if (phase === "break") {
    return session.breakMinutes * 60 * 1000;
  }

  if (phase === "final-study") {
    return session.finalStudyMinutes * 60 * 1000;
  }

  return 0;
}

function updateSessionPhase() {
  const session = store.session;

  if (!session.active || !session.phaseStartedAt) {
    return session;
  }

  if (
    session.currentPhase !== "study" &&
    session.currentPhase !== "break" &&
    session.currentPhase !== "final-study"
  ) {
    return session;
  }

  const now = getNow();
  const elapsed = now - session.phaseStartedAt;
  const phaseDuration = getPhaseDurationMs(session.currentPhase, session);

  if (elapsed < phaseDuration) {
    return session;
  }

  if (session.currentPhase === "study") {
    session.currentPhase = "break";
    session.phaseStartedAt = now;
    return session;
  }

  if (session.currentPhase === "break") {
    session.currentPhase = "final-study";
    session.phaseStartedAt = now;
    return session;
  }

  if (session.currentPhase === "final-study") {
    session.currentPhase = "idle";
    session.active = false;
    session.startedAt = null;
    session.phaseStartedAt = null;
    session.alarmActive = false;
    session.challengeQuestion = null;
    session.challengeAnswer = null;
    session.unlockUntil = null;
    return session;
  }

  return session;
}

function getTimeLeftMs() {
  const session = store.session;
  updateSessionPhase();

  if (!session.active || !session.phaseStartedAt) {
    return 0;
  }

  const phaseDuration = getPhaseDurationMs(session.currentPhase, session);
  const elapsed = getNow() - session.phaseStartedAt;
  const remaining = phaseDuration - elapsed;

  return remaining > 0 ? remaining : 0;
}

function isTemporarilyUnlocked() {
  const session = store.session;

  if (!session.unlockUntil) {
    return false;
  }

  return getNow() < session.unlockUntil;
}

function isBlockedUrl(url) {
  const session = store.session;

  if (!url || typeof url !== "string") {
    return false;
  }

  return session.blockedSites.some((site) => url.includes(site));
}

module.exports = {
  updateSessionPhase,
  getTimeLeftMs,
  isTemporarilyUnlocked,
  isBlockedUrl
};