const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// @route   GET api/cars
// @desc    Get all cars
// @access  Private
router.get('/', auth, (req, res) => {
  const db = req.app.locals.db;

  try {
    db.query('SELECT * FROM Car ORDER BY PlateNumber', (err, results) => {
      if (err) {
        console.error('Error fetching cars:', err);
        return res.status(500).json({ msg: 'Server error' });
      }

      res.json(results);
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/cars/:plateNumber
// @desc    Get car by plate number
// @access  Private
router.get('/:plateNumber', auth, (req, res) => {
  const db = req.app.locals.db;
  const { plateNumber } = req.params;

  try {
    db.query('SELECT * FROM Car WHERE PlateNumber = ?', [plateNumber], (err, results) => {
      if (err) {
        console.error('Error fetching car:', err);
        return res.status(500).json({ msg: 'Server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ msg: 'Car not found' });
      }

      res.json(results[0]);
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST api/cars
// @desc    Add a new car
// @access  Private
router.post('/', auth, (req, res) => {
  const { plateNumber, type, model, manufacturingYear, driverPhone, mechanicName } = req.body;
  const db = req.app.locals.db;

  // Validate input
  if (!plateNumber || !type || !model || !manufacturingYear || !driverPhone || !mechanicName) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // Check if car already exists
    db.query('SELECT * FROM Car WHERE PlateNumber = ?', [plateNumber], (err, results) => {
      if (err) {
        console.error('Error checking car:', err);
        return res.status(500).json({ msg: 'Server error' });
      }

      if (results.length > 0) {
        return res.status(400).json({ msg: 'Car with this plate number already exists' });
      }

      // Add new car
      const query = `
        INSERT INTO Car (PlateNumber, type, Model, ManufacturingYear, DriverPhone, MechanicName) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      db.query(
        query,
        [plateNumber, type, model, manufacturingYear, driverPhone, mechanicName],
        (err, results) => {
          if (err) {
            console.error('Error adding car:', err);
            return res.status(500).json({ msg: 'Server error' });
          }

          res.status(201).json({ 
            msg: 'Car added successfully',
            car: {
              plateNumber,
              type,
              model,
              manufacturingYear,
              driverPhone,
              mechanicName
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
