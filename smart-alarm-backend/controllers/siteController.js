const store = require("../data/store");
const { generateMathChallenge } = require("../services/challengeService");
const {
  updateSessionPhase,
  isBlockedUrl,
  isTemporarilyUnlocked
} = require("../services/sessionService");

function getSites(req, res) {
  return res.json({
    success: true,
    data: {
      blockedSites: store.session.blockedSites
    }
  });
}

function addSite(req, res) {
  const { site } = req.body;

  if (!site || typeof site !== "string") {
    return res.status(400).json({
      success: false,
      message: "A valid site is required"
    });
  }

  if (!store.session.blockedSites.includes(site)) {
    store.session.blockedSites.push(site);
  }

  return res.json({
    success: true,
    message: "Site added",
    data: {
      blockedSites: store.session.blockedSites
    }
  });
}

function removeSite(req, res) {
  const { site } = req.body;

  if (!site || typeof site !== "string") {
    return res.status(400).json({
      success: false,
      message: "A valid site is required"
    });
  }

  store.session.blockedSites = store.session.blockedSites.filter(
    (blockedSite) => blockedSite !== site
  );

  return res.json({
    success: true,
    message: "Site removed",
    data: {
      blockedSites: store.session.blockedSites
    }
  });
}

function checkSite(req, res) {
  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({
      success: false,
      message: "A valid URL is required"
    });
  }

  updateSessionPhase();

  if (!store.session.active) {
    return res.json({
      success: true,
      data: {
        shouldBlock: false,
        reason: "No active session"
      }
    });
  }

  if (store.session.currentPhase === "break") {
    return res.json({
      success: true,
      data: {
        shouldBlock: false,
        reason: "User is currently on a break"
      }
    });
  }

  const blocked = isBlockedUrl(url);
  const unlocked = isTemporarilyUnlocked();

  if (blocked && !unlocked) {
    if (!store.session.alarmActive) {
      const challenge = generateMathChallenge();
      store.session.alarmActive = true;
      store.session.currentPhase = "alarm";
      store.session.challengeQuestion = challenge.question;
      store.session.challengeAnswer = challenge.answer;
    }

    return res.json({
      success: true,
      data: {
        shouldBlock: true,
        reason: "Blocked site during focus session",
        alarmActive: true,
        challengeQuestion: store.session.challengeQuestion
      }
    });
  }

  return res.json({
    success: true,
    data: {
      shouldBlock: false,
      reason: blocked && unlocked
        ? "Temporarily unlocked"
        : "Allowed"
    }
  });
}

module.exports = {
  getSites,
  addSite,
  removeSite,
  checkSite
};