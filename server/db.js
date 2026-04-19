const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dataDir = process.env.VERCEL ? '/tmp' : path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, 'treasure.db'));

function init() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      email      TEXT    NOT NULL UNIQUE,
      password   TEXT    NOT NULL,
      created_at TEXT    DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS game_sessions (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id      INTEGER NOT NULL REFERENCES users(id),
      final_score  INTEGER NOT NULL,
      won          INTEGER NOT NULL,
      boxes_opened INTEGER NOT NULL,
      played_at    TEXT    DEFAULT (datetime('now'))
    );
  `);
  console.log('Database initialized');
}

module.exports = { db, init };
