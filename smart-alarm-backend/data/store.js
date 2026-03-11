const store = {
  session: {
    active: false,
    currentPhase: "idle",
    studyMinutes: 45,
    breakMinutes: 5,
    finalStudyMinutes: 10,

    startedAt: null,
    phaseStartedAt: null,

    blockedSites: [
      "youtube.com",
      "www.youtube.com",
      "instagram.com",
      "www.instagram.com",
      "tiktok.com",
      "www.tiktok.com"
    ],

    alarmActive: false,
    challengeQuestion: null,
    challengeAnswer: null,

    unlockUntil: null
  }
};

module.exports = store;