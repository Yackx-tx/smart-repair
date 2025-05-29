const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Read SQL file
const sqlFilePath = path.join(__dirname, 'db_init.sql');
const sqlScript = fs.readFileSync(sqlFilePath, 'utf8');

// Create MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true // This allows multiple SQL statements in one query
});

console.log('Connecting to MySQL...');

// Connect to MySQL
connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  
  console.log('Connected to MySQL successfully');
  console.log('Initializing database and tables...');
  
  // Execute SQL script
  connection.query(sqlScript, (err, results) => {
    if (err) {
      console.error('Error executing SQL script:', err);
      connection.end();
      return;
    }
    
    console.log('Database and tables initialized successfully');
    console.log('Default services and admin user created');
    console.log('Default admin credentials:');
    console.log('Username: admin');
    console.log('Password: Admin123!');
    console.log('Please change this password immediately after first login');
    
    // Close connection
    connection.end(err => {
      if (err) {
        console.error('Error closing connection:', err);
        return;
      }
      console.log('MySQL connection closed');
    });
  });
});
