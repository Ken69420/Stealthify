const express = require('express');
const router = express.Router();

// In-memory storage for the counter state
// In a production app, this would be stored in a database
let counterState = {
  currentCount: 0n, // Using BigInt for large numbers
  isRunning: false,
  startTime: null,
  pausedTime: 0, // Total time spent paused
  target: 1000000000000000n // 1 pentillion (10^15)
};

let intervalId = null;

// Convert BigInt to string for JSON serialization
const serializeState = (state) => ({
  currentCount: state.currentCount.toString(),
  isRunning: state.isRunning,
  startTime: state.startTime,
  pausedTime: state.pausedTime,
  target: state.target.toString(),
  progress: Number(state.currentCount * 10000n / state.target) / 100, // Progress as percentage
  estimatedTimeRemaining: state.currentCount > 0n ? 
    Number((state.target - state.currentCount)) : null // Seconds remaining
});

// Start the counter
router.post('/start', (req, res) => {
  if (counterState.isRunning) {
    return res.status(400).json({ error: 'Counter is already running' });
  }

  counterState.isRunning = true;
  counterState.startTime = counterState.startTime || Date.now();

  // Start counting - increment every 1000ms (1 second)
  intervalId = setInterval(() => {
    if (counterState.currentCount < counterState.target) {
      counterState.currentCount += 1n;
    } else {
      // Reached the target
      clearInterval(intervalId);
      counterState.isRunning = false;
      intervalId = null;
    }
  }, 1000);

  res.json({
    message: 'Counter started',
    state: serializeState(counterState)
  });
});

// Pause the counter
router.post('/pause', (req, res) => {
  if (!counterState.isRunning) {
    return res.status(400).json({ error: 'Counter is not running' });
  }

  counterState.isRunning = false;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  res.json({
    message: 'Counter paused',
    state: serializeState(counterState)
  });
});

// Reset the counter
router.post('/reset', (req, res) => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  counterState = {
    currentCount: 0n,
    isRunning: false,
    startTime: null,
    pausedTime: 0,
    target: 1000000000000000n
  };

  res.json({
    message: 'Counter reset',
    state: serializeState(counterState)
  });
});

// Get current counter state
router.get('/status', (req, res) => {
  res.json({
    state: serializeState(counterState)
  });
});

// Set a custom target (optional feature)
router.post('/target', (req, res) => {
  const { target } = req.body;
  
  if (!target || isNaN(target) || BigInt(target) <= 0n) {
    return res.status(400).json({ error: 'Invalid target number' });
  }

  if (counterState.isRunning) {
    return res.status(400).json({ error: 'Cannot change target while counter is running' });
  }

  counterState.target = BigInt(target);
  
  res.json({
    message: 'Target updated',
    state: serializeState(counterState)
  });
});

module.exports = router;