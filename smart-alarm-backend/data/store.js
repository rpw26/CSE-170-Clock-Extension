const store = {
  timer: {
    active: false,
    paused: false,
    mode: "pomodoro", // pomodoro or custom
    durationSeconds: 1500,
    timeLeftSeconds: 1500,
    startedAt: null,
    pausedAt: null
  }
};

module.exports = store;