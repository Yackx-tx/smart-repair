-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS CRPMS;

-- Use the CRPMS database
USE CRPMS;

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  fullName VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Services table
CREATE TABLE IF NOT EXISTS Services (
  ServiceCode VARCHAR(20) PRIMARY KEY,
  ServiceName VARCHAR(100) NOT NULL,
  ServicePrice DECIMAL(10, 2) NOT NULL
);

-- Create Car table
CREATE TABLE IF NOT EXISTS Car (
  PlateNumber VARCHAR(20) PRIMARY KEY,
  type VARCHAR(50) NOT NULL,
  Model VARCHAR(50) NOT NULL,
  ManufacturingYear INT NOT NULL,
  DriverPhone VARCHAR(20) NOT NULL,
  MechanicName VARCHAR(100) NOT NULL
);

-- Create ServiceRecord table
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
);

-- Insert default services
INSERT INTO Services (ServiceCode, ServiceName, ServicePrice) VALUES
('ENG001', 'Engine repair', 150000),
('TRA001', 'Transmission repair', 80000),
('OIL001', 'Oil Change', 60000),
('CHA001', 'Chain replacement', 40000),
('DIS001', 'Disc replacement', 400000),
('WHE001', 'Wheel alignment', 5000);

-- Create a default admin user (password will be hashed in the application)
-- This is just for initial setup, you should change this password immediately
-- The password here is 'Admin123!' but it will be hashed by bcrypt in the application
INSERT INTO Users (username, password, fullName, role) VALUES
('admin', '$2b$10$X5mFxFpLzh5Yg3MiR.WIzOIwzlnhx6VxLWX5pHxIgEzKPQm0QCnAy', 'System Administrator', 'admin');
