require('dotenv').config();

const mysql = require('mysql2');

// Create a connection pool instead of a single connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,  // Remove default password
  database: process.env.DB_NAME || 'contract_flow',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Get a promise-based interface for the pool
const promisePool = pool.promise();

// Test the connection
promisePool.getConnection()
  .then(connection => {
    console.log('Successfully connected to the database.');
    connection.release();
  })
  .catch(error => {
    console.error('Error connecting to the database:', error.message);
    process.exit(1);  // Exit if we can't connect to the database
  });

module.exports = promisePool;  // Export the promise-based pool