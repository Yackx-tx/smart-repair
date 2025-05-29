const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// @route   GET api/reports/daily
// @desc    Get daily report
// @access  Private
router.get('/daily', auth, (req, res) => {
  const db = req.app.locals.db;
  const { date } = req.query;
  
  // If no date provided, use today
  const reportDate = date ? new Date(date) : new Date();
  
  // Format date for MySQL query (YYYY-MM-DD)
  const formattedDate = reportDate.toISOString().split('T')[0];
  
  try {
    const query = `
      SELECT sr.RecordNumber, sr.PlateNumber, c.type, c.Model, s.ServiceName, 
             sr.AmountPaid, sr.PaymentDate, u.username as ReceivedBy
      FROM ServiceRecord sr
      JOIN Car c ON sr.PlateNumber = c.PlateNumber
      JOIN Services s ON sr.ServiceCode = s.ServiceCode
      JOIN Users u ON sr.ReceivedBy = u.id
      WHERE DATE(sr.PaymentDate) = ?
      ORDER BY sr.PaymentDate
    `;
    
    db.query(query, [formattedDate], (err, results) => {
      if (err) {
        console.error('Error generating daily report:', err);
        return res.status(500).json({ msg: 'Server error' });
      }

      // Calculate summary
      const summary = {
        date: formattedDate,
        totalRecords: results.length,
        totalAmount: results.reduce((sum, record) => sum + parseFloat(record.AmountPaid), 0),
        services: {}
      };

      // Group by service
      results.forEach(record => {
        if (!summary.services[record.ServiceName]) {
          summary.services[record.ServiceName] = {
            count: 0,
            amount: 0
          };
        }
        
        summary.services[record.ServiceName].count += 1;
        summary.services[record.ServiceName].amount += parseFloat(record.AmountPaid);
      });

      res.json({
        summary,
        records: results
      });
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET api/reports/bill/:recordNumber
// @desc    Generate bill for a service record
// @access  Private
router.get('/bill/:recordNumber', auth, (req, res) => {
  const db = req.app.locals.db;
  const { recordNumber } = req.params;

  try {
    const query = `
      SELECT sr.RecordNumber, sr.PlateNumber, c.type, c.Model, c.DriverPhone, 
             c.MechanicName, s.ServiceName, s.ServicePrice, sr.AmountPaid, 
             sr.PaymentDate, u.fullName as ReceivedBy
      FROM ServiceRecord sr
      JOIN Car c ON sr.PlateNumber = c.PlateNumber
      JOIN Services s ON sr.ServiceCode = s.ServiceCode
      JOIN Users u ON sr.ReceivedBy = u.id
      WHERE sr.RecordNumber = ?
    `;
    
    db.query(query, [recordNumber], (err, results) => {
      if (err) {
        console.error('Error generating bill:', err);
        return res.status(500).json({ msg: 'Server error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ msg: 'Service record not found' });
      }

      const record = results[0];
      
      // Format bill data
      const bill = {
        billNumber: `BILL-${record.RecordNumber}`,
        date: new Date(record.PaymentDate).toISOString().split('T')[0],
        car: {
          plateNumber: record.PlateNumber,
          type: record.type,
          model: record.Model,
          driverPhone: record.DriverPhone,
          mechanicName: record.MechanicName
        },
        service: {
          name: record.ServiceName,
          price: parseFloat(record.ServicePrice)
        },
        payment: {
          amountPaid: parseFloat(record.AmountPaid),
          receivedBy: record.ReceivedBy
        },
        balance: parseFloat(record.ServicePrice) - parseFloat(record.AmountPaid)
      };

      res.json(bill);
    });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
