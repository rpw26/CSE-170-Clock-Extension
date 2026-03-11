const store = require("../data/store");

function getNowSeconds() {
  return Math.floor(Date.now() / 1000);
}

function syncTimer() {
  const timer = store.timer;

  if (!timer.active || timer.paused || !timer.startedAt) {
    return timer;
  }

  const now = getNowSeconds();
  const elapsed = now - timer.startedAt;
  const remaining = timer.durationSeconds - elapsed;

  timer.timeLeftSeconds = remaining > 0 ? remaining : 0;

  if (timer.timeLeftSeconds === 0) {
    timer.active = false;
    timer.paused = false;
    timer.startedAt = null;
    timer.pausedAt = null;
  }

  return timer;
}

function startTimer(mode, customMinutes = null) {
  let durationSeconds;

  if (mode === "pomodoro") {
    durationSeconds = 25 * 60;
  } else if (mode === "custom") {
    durationSeconds = Number(customMinutes) * 60;
  } else {
    throw new Error("Invalid timer mode");
  }

  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    throw new Error("Invalid timer duration");
  }

  store.timer = {
    active: true,
    paused: false,
    mode,
    durationSeconds,
    timeLeftSeconds: durationSeconds,
    startedAt: getNowSeconds(),
    pausedAt: null
  };

  return store.timer;
}

function stopTimer() {
  store.timer = {
    active: false,
    paused: false,
    mode: store.timer.mode,
    durationSeconds: store.timer.durationSeconds,
    timeLeftSeconds: 0,
    startedAt: null,
    pausedAt: null
  };

  return store.timer;
}

function pauseTimer() {
  const timer = store.timer;
  syncTimer();

  if (!timer.active) {
    throw new Error("No active timer to pause");
  }

  if (timer.paused) {
    throw new Error("Timer is already paused");
  }

  timer.paused = true;
  timer.pausedAt = getNowSeconds();

  return timer;
}

function resumeTimer() {
  const timer = store.timer;

  if (!timer.active) {
    throw new Error("No active timer to resume");
  }

  if (!timer.paused) {
    throw new Error("Timer is not paused");
  }

  timer.paused = false;
  timer.startedAt = getNowSeconds() - (timer.durationSeconds - timer.timeLeftSeconds);
  timer.pausedAt = null;

  return timer;
}

function resetTimer() {
  const timer = store.timer;

  store.timer = {
    active: false,
    paused: false,
    mode: timer.mode,
    durationSeconds: timer.durationSeconds,
    timeLeftSeconds: timer.durationSeconds,
    startedAt: null,
    pausedAt: null
  };

  return store.timer;
}

module.exports = {
  syncTimer,
  startTimer,
  stopTimer,
  pauseTimer,
  resumeTimer,
  resetTimer
};