const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const auth = require('../middleware/auth');

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  const { username, password, fullName, role } = req.body;
  const db = req.app.locals.db;

  try {
    // Validate password strength
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        msg: 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character' 
      });
    }

    // Check if user already exists
    db.query('SELECT * FROM Users WHERE username = ?', [username], async (err, results) => {
      if (err) {
        console.error('Error checking user:', err);
        return res.status(500).json({ msg: 'Server error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      db.query(
        'INSERT INTO Users (username, password, fullName, role) VALUES (?, ?, ?, ?)',
        [username, hashedPassword, fullName, role],
        (err, results) => {
          if (err) {
            console.error('Error creating user:', err);
            return res.status(500).json({ msg: 'Server error' });
          }

          // Create and return JWT token
          const payload = {
            user: {
              id: results.insertId,
              username,
              role
            }
          };

          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
              if (err) throw err;
              res.json({ token });
            }
          );
        }
      );
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const db = req.app.locals.db;

  try {
    // Check if user exists
    db.query('SELECT * FROM Users WHERE username = ?', [username], async (err, results) => {
      if (err) {
        console.error('Error checking user:', err);
        return res.status(500).json({ msg: 'Server error' });
      }

      if (results.length === 0) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      const user = results[0];

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Create and return JWT token
      const payload = {
        user: {
          id: user.id,
          username: user.username,
          role: user.role
        }
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '24h' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, (req, res) => {
  const db = req.app.locals.db;

  try {
    db.query('SELECT id, username, fullName, role FROM Users WHERE id = ?', [req.user.id], (err, results) => {
      if (err) {
        console.error('Error fetching user:', err);
        return res.status(500).json({ msg: 'Server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ msg: 'User not found' });
      }

      res.json(results[0]);
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
