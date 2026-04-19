const express = require('express');
const { db } = require('../db');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

router.post('/scores', requireAuth, (req, res) => {
  const { finalScore, won, boxesOpened } = req.body;
  if (finalScore === undefined || won === undefined || boxesOpened === undefined) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  const result = db.prepare(
    'INSERT INTO game_sessions (user_id, final_score, won, boxes_opened) VALUES (?, ?, ?, ?)'
  ).run(req.user.id, finalScore, won ? 1 : 0, boxesOpened);

  res.json({ id: result.lastInsertRowid });
});

router.get('/scores/me', requireAuth, (req, res) => {
  const sessions = db.prepare(
    'SELECT id, final_score, won, boxes_opened, played_at FROM game_sessions WHERE user_id = ? ORDER BY played_at DESC LIMIT 5'
  ).all(req.user.id);

  const stats = db.prepare(
    'SELECT COUNT(*) as totalGames, SUM(won) as wins, SUM(final_score) as totalScore FROM game_sessions WHERE user_id = ?'
  ).get(req.user.id);

  res.json({
    sessions,
    stats: {
      totalGames: stats.totalGames || 0,
      wins: stats.wins || 0,
      losses: (stats.totalGames || 0) - (stats.wins || 0),
      totalScore: stats.totalScore || 0,
    },
  });
});

module.exports = router;
