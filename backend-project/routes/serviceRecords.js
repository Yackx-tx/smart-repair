const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// @route   GET api/service-records
// @desc    Get all service records
// @access  Private
router.get('/', auth, (req, res) => {
  const db = req.app.locals.db;

  try {
    const query = `
      SELECT sr.*, c.type, c.Model, c.DriverPhone, c.MechanicName, s.ServiceName, u.username as ReceivedByUser
      FROM ServiceRecord sr
      JOIN Car c ON sr.PlateNumber = c.PlateNumber
      JOIN Services s ON sr.ServiceCode = s.ServiceCode
      JOIN Users u ON sr.ReceivedBy = u.id
      ORDER BY sr.PaymentDate DESC
    `;
    
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching service records:', err);
        return res.status(500).json({ msg: 'Server error' });
      }

      res.json(results);
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/service-records/:recordNumber
// @desc    Get service record by record number
// @access  Private
router.get('/:recordNumber', auth, (req, res) => {
  const db = req.app.locals.db;
  const { recordNumber } = req.params;

  try {
    const query = `
      SELECT sr.*, c.type, c.Model, c.DriverPhone, c.MechanicName, s.ServiceName, u.username as ReceivedByUser
      FROM ServiceRecord sr
      JOIN Car c ON sr.PlateNumber = c.PlateNumber
      JOIN Services s ON sr.ServiceCode = s.ServiceCode
      JOIN Users u ON sr.ReceivedBy = u.id
      WHERE sr.RecordNumber = ?
    `;
    
    db.query(query, [recordNumber], (err, results) => {
      if (err) {
        console.error('Error fetching service record:', err);
        return res.status(500).json({ msg: 'Server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ msg: 'Service record not found' });
      }

      res.json(results[0]);
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST api/service-records
// @desc    Add a new service record
// @access  Private
router.post('/', auth, (req, res) => {
  const { plateNumber, serviceCode, amountPaid } = req.body;
  const db = req.app.locals.db;
  const receivedBy = req.user.id;

  // Validate input
  if (!plateNumber || !serviceCode || !amountPaid) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // Check if car exists
    db.query('SELECT * FROM Car WHERE PlateNumber = ?', [plateNumber], (err, carResults) => {
      if (err) {
        console.error('Error checking car:', err);
        return res.status(500).json({ msg: 'Server error' });
      }

      if (carResults.length === 0) {
        return res.status(400).json({ msg: 'Car not found' });
      }

      // Check if service exists
      db.query('SELECT * FROM Services WHERE ServiceCode = ?', [serviceCode], (err, serviceResults) => {
        if (err) {
          console.error('Error checking service:', err);
          return res.status(500).json({ msg: 'Server error' });
        }

        if (serviceResults.length === 0) {
          return res.status(400).json({ msg: 'Service not found' });
        }

        // Add new service record
        const query = `
          INSERT INTO ServiceRecord (PlateNumber, ServiceCode, AmountPaid, ReceivedBy) 
          VALUES (?, ?, ?, ?)
        `;
        
        db.query(
          query,
          [plateNumber, serviceCode, amountPaid, receivedBy],
          (err, results) => {
            if (err) {
              console.error('Error adding service record:', err);
              return res.status(500).json({ msg: 'Server error' });
            }

            // Get the newly created record
            db.query(
              'SELECT * FROM ServiceRecord WHERE RecordNumber = ?',
              [results.insertId],
              (err, newRecord) => {
                if (err) {
                  console.error('Error fetching new record:', err);
                  return res.status(500).json({ msg: 'Server error' });
                }

                res.status(201).json({ 
                  msg: 'Service record added successfully',
                  record: newRecord[0]
                });
              }
            );
          }
        );
      });
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT api/service-records/:recordNumber
// @desc    Update a service record
// @access  Private
router.put('/:recordNumber', auth, (req, res) => {
  const { plateNumber, serviceCode, amountPaid } = req.body;
  const { recordNumber } = req.params;
  const db = req.app.locals.db;

  // Validate input
  if (!plateNumber || !serviceCode || !amountPaid) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  try {
    // Check if record exists
    db.query('SELECT * FROM ServiceRecord WHERE RecordNumber = ?', [recordNumber], (err, recordResults) => {
      if (err) {
        console.error('Error checking record:', err);
        return res.status(500).json({ msg: 'Server error' });
      }

      if (recordResults.length === 0) {
        return res.status(404).json({ msg: 'Service record not found' });
      }

      // Check if car exists
      db.query('SELECT * FROM Car WHERE PlateNumber = ?', [plateNumber], (err, carResults) => {
        if (err) {
          console.error('Error checking car:', err);
          return res.status(500).json({ msg: 'Server error' });
        }

        if (carResults.length === 0) {
          return res.status(400).json({ msg: 'Car not found' });
        }

        // Check if service exists
        db.query('SELECT * FROM Services WHERE ServiceCode = ?', [serviceCode], (err, serviceResults) => {
          if (err) {
            console.error('Error checking service:', err);
            return res.status(500).json({ msg: 'Server error' });
          }

          if (serviceResults.length === 0) {
            return res.status(400).json({ msg: 'Service not found' });
          }

          // Update service record
          const query = `
            UPDATE ServiceRecord 
            SET PlateNumber = ?, ServiceCode = ?, AmountPaid = ?
            WHERE RecordNumber = ?
          `;
          
          db.query(
            query,
            [plateNumber, serviceCode, amountPaid, recordNumber],
            (err, results) => {
              if (err) {
                console.error('Error updating service record:', err);
                return res.status(500).json({ msg: 'Server error' });
              }

              res.json({ 
                msg: 'Service record updated successfully',
                record: {
                  recordNumber,
                  plateNumber,
                  serviceCode,
                  amountPaid
                }
              });
            }
          );
        });
      });
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE api/service-records/:recordNumber
// @desc    Delete a service record
// @access  Private
router.delete('/:recordNumber', auth, (req, res) => {
  const { recordNumber } = req.params;
  const db = req.app.locals.db;

  try {
    // Check if record exists
    db.query('SELECT * FROM ServiceRecord WHERE RecordNumber = ?', [recordNumber], (err, results) => {
      if (err) {
        console.error('Error checking record:', err);
        return res.status(500).json({ msg: 'Server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ msg: 'Service record not found' });
      }

      // Delete service record
      db.query('DELETE FROM ServiceRecord WHERE RecordNumber = ?', [recordNumber], (err) => {
        if (err) {
          console.error('Error deleting service record:', err);
          return res.status(500).json({ msg: 'Server error' });
        }

        res.json({ msg: 'Service record deleted successfully' });
      });
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
