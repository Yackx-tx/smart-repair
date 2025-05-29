const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5175'],
  credentials: true,
}));
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'CRPMS'
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
  
  // Create database if it doesn't exist
  db.query(`CREATE DATABASE IF NOT EXISTS CRPMS`, (err) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    
    // Use the CRPMS database
    db.query(`USE CRPMS`, (err) => {
      if (err) {
        console.error('Error using database:', err);
        return;
      }
      
      // Create Users table
      const createUsersTable = `
        CREATE TABLE IF NOT EXISTS Users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(50) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          fullName VARCHAR(100) NOT NULL,
          role VARCHAR(20) NOT NULL,
          createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      db.query(createUsersTable, (err) => {
        if (err) {
          console.error('Error creating Users table:', err);
          return;
        }
        console.log('Users table created or already exists');
      });
      
      // Create Services table
      const createServicesTable = `
        CREATE TABLE IF NOT EXISTS Services (
          ServiceCode VARCHAR(20) PRIMARY KEY,
          ServiceName VARCHAR(100) NOT NULL,
          ServicePrice DECIMAL(10, 2) NOT NULL
        )
      `;
      
      db.query(createServicesTable, (err) => {
        if (err) {
          console.error('Error creating Services table:', err);
          return;
        }
        console.log('Services table created or already exists');
        
        // Insert default services if they don't exist
        const defaultServices = [
          ['ENG001', 'Engine repair', 150000],
          ['TRA001', 'Transmission repair', 80000],
          ['OIL001', 'Oil Change', 60000],
          ['CHA001', 'Chain replacement', 40000],
          ['DIS001', 'Disc replacement', 400000],
          ['WHE001', 'Wheel alignment', 5000]
        ];
        
        // Check if services already exist
        db.query('SELECT COUNT(*) as count FROM Services', (err, results) => {
          if (err) {
            console.error('Error checking services:', err);
            return;
          }
          
          if (results[0].count === 0) {
            // Insert default services
            const insertServices = 'INSERT INTO Services (ServiceCode, ServiceName, ServicePrice) VALUES ?';
            db.query(insertServices, [defaultServices], (err) => {
              if (err) {
                console.error('Error inserting default services:', err);
                return;
              }
              console.log('Default services inserted');
            });
          }
        });
      });
      
      // Create Car table
      const createCarTable = `
        CREATE TABLE IF NOT EXISTS Car (
          PlateNumber VARCHAR(20) PRIMARY KEY,
          type VARCHAR(50) NOT NULL,
          Model VARCHAR(50) NOT NULL,
          ManufacturingYear INT NOT NULL,
          DriverPhone VARCHAR(20) NOT NULL,
          MechanicName VARCHAR(100) NOT NULL
        )
      `;
      
      db.query(createCarTable, (err) => {
        if (err) {
          console.error('Error creating Car table:', err);
          return;
        }
        console.log('Car table created or already exists');
      });
      
      // Create ServiceRecord table
      const createServiceRecordTable = `
        CREATE TABLE IF NOT EXISTS ServiceRecord (
          RecordNumber INT AUTO_INCREMENT PRIMARY KEY,
          PlateNumber VARCHAR(20) NOT NULL,
          ServiceCode VARCHAR(20) NOT NULL,
          AmountPaid DECIMAL(10, 2) NOT NULL,
          PaymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          ReceivedBy INT NOT NULL,
          FOREIGN KEY (PlateNumber) REFERENCES Car(PlateNumber),
          FOREIGN KEY (ServiceCode) REFERENCES Services(ServiceCode),
          FOREIGN KEY (ReceivedBy) REFERENCES Users(id)
        )
      `;
      
      db.query(createServiceRecordTable, (err) => {
        if (err) {
          console.error('Error creating ServiceRecord table:', err);
          return;
        }
        console.log('ServiceRecord table created or already exists');
      });
    });
  });
});

// Import routes
const authRoutes = require('./routes/auth');
const carRoutes = require('./routes/cars');
const serviceRoutes = require('./routes/services');
const serviceRecordRoutes = require('./routes/serviceRecords');
const reportRoutes = require('./routes/reports');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/service-records', serviceRecordRoutes);
app.use('/api/reports', reportRoutes);

// Make db available to routes
app.locals.db = db;

// Default route
app.get('/', (req, res) => {
  res.send('CRPMS API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
