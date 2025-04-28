const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');
require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use('/api/projects', require('./routes/projects'));
app.use('/api/contractors', require('./routes/contractors'));
app.use('/api/advance-payments', require('./routes/advancePayments'));
app.use('/api/bill-payments', require('./routes/billPayments'));
app.use('/api/adjustments', require('./routes/adjustments'));

// Serve static files from the React build directory
app.use(express.static(path.join(__dirname, '../build')));

// Handle any requests that don't match the API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

// Error handling middleware
app.use(errorHandler);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});