const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// @route   GET api/services
// @desc    Get all services
// @access  Private
router.get('/', auth, (req, res) => {
  const db = req.app.locals.db;

  try {
    db.query('SELECT * FROM Services ORDER BY ServiceName', (err, results) => {
      if (err) {
        console.error('Error fetching services:', err);
        return res.status(500).json({ msg: 'Server error' });
      }

      res.json(results);
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/services/:serviceCode
// @desc    Get service by code
// @access  Private
router.get('/:serviceCode', auth, (req, res) => {
  const db = req.app.locals.db;
  const { serviceCode } = req.params;

  try {
    db.query('SELECT * FROM Services WHERE ServiceCode = ?', [serviceCode], (err, results) => {
      if (err) {
        console.error('Error fetching service:', err);
        return res.status(500).json({ msg: 'Server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ msg: 'Service not found' });
      }

      res.json(results[0]);
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST api/services
// @desc    Add a new service
// @access  Private
router.post('/', auth, (req, res) => {
  const { serviceCode, serviceName, servicePrice } = req.body;
  const db = req.app.locals.db;

  // Validate input
  if (!serviceCode || !serviceName || !servicePrice) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // Check if service already exists
    db.query('SELECT * FROM Services WHERE ServiceCode = ?', [serviceCode], (err, results) => {
      if (err) {
        console.error('Error checking service:', err);
        return res.status(500).json({ msg: 'Server error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ msg: 'Service with this code already exists' });
      }

      // Add new service
      const query = `
        INSERT INTO Services (ServiceCode, ServiceName, ServicePrice) 
        VALUES (?, ?, ?)
      `;
      
      db.query(
        query,
        [serviceCode, serviceName, servicePrice],
        (err, results) => {
          if (err) {
            console.error('Error adding service:', err);
            return res.status(500).json({ msg: 'Server error' });
          }

          res.status(201).json({ 
            msg: 'Service added successfully',
            service: {
              serviceCode,
              serviceName,
              servicePrice
            }
          });
        }
      );
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
