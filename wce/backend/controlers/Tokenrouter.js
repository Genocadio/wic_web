const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const Tokenrouter = express.Router();

const ACCESS_TOKEN_SECRET = process.env.SECRET;
const CHALLENGE_TOKEN_SECRET = 'your_challenge_token_secret';
const challengeTokenBlacklist = new Set();

// Middleware to verify JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  console.log('auth :', token)
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Generate Challenge Token
Tokenrouter.get('/cha', (req, res) => {
  const challengeToken = jwt.sign({ id: uuidv4() }, CHALLENGE_TOKEN_SECRET, { expiresIn: '15m' });
  res.json({ challengeToken });
});

// Refresh Token
Tokenrouter.post('/ref', async (req, res) => {
  const challengeToken = req.header('X-Challenge-Token'); // Retrieve challenge token from custom header

  if (!challengeToken) {
    return res.status(403).json({ error: 'Challenge token is required.' });
  }

  // Check if challenge token is in blacklist
  if (challengeTokenBlacklist.has(challengeToken)) {
    return res.status(403).json({ error: 'Challenge token has already been used.' });
  }
  const user = req.user
  // Verify the challenge token
  jwt.verify(challengeToken,  CHALLENGE_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // Forbidden if token verification fails
    }
    decoded.user = user;
    // Add the challenge token to the blacklist to prevent replay attacks
    challengeTokenBlacklist.add(challengeToken);
    // console.log('Blacklisted challenge tokens:', challengeTokenBlacklist);

    // Generate a new access token
    const userForToken = {
      email: user.email,
      id: user._id
    };
  
    // Generate JWT token
    console.log('in Login', process.env.SECRET);
    console.log('User:', user);
    const accessToken = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' });

    // Return the new access token to the client
    res.json({ accessToken });
  });
});

// Cleanup old entries from challengeTokenBlacklist every hour
setInterval(() => {
  cleanupChallengeTokenBlacklist();
}, 1000 * 60 * 60); // Runs every hour (adjust interval as needed)

// Function to clean up old entries from challengeTokenBlacklist
function cleanupChallengeTokenBlacklist() {
  const now = Date.now();
  for (const token of challengeTokenBlacklist) {
    const decoded = jwt.decode(token);
    if (decoded.exp * 1000 < now) {
      challengeTokenBlacklist.delete(token);
    }
  }
  console.log('Challenge token blacklist cleaned up.', challengeTokenBlacklist);
}

module.exports = Tokenrouter;
