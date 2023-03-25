const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const dbConfig = require('./db_config');
const app = express();
const port = process.env.PORT || 3000;

// Use body-parser middleware to parse JSON data
app.use(bodyParser.json());

// Set up MySQL connection
const connection = mysql.createConnection(dbConfig);

// Test MySQL connection
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.stack);
    return;
  }
  console.log('Connected to MySQL as id:', connection.threadId);
});

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the Simple Node.js API!', req});
});

// Add a new GET route to test MySQL connection
app.get('/api/test-connection', (req, res) => {
    connection.ping((err) => {
      if (err) {
        console.error('Error testing MySQL connection:', err.stack);
        res.status(500).json({ message: 'Error testing MySQL connection', error: err });
      } else {
        res.status(200).json({ message: 'MySQL connection is successful!' });
      }
    });
  });
  

// Add a POST route to handle incoming JSON objects
app.post('/api', (req, res) => {
  const receivedData = req.body;
  console.log('Received JSON object:', req.body);
  res.json(req.json());
  // Insert data into the MySQL database
  const query = 'INSERT INTO sensor_data (dateTime, temperature, humidity, relay_status) VALUES (?, ?, ?, ?)';
  const values = [receivedData.dateTime, receivedData.temperature, receivedData.humidity, receivedData.relay_status];

  //res.status(200).json({ message: 'submitted data', data: receivedData });
//   connection.query(query, values, (err, result) => {
//     if (err) {
//       console.error('Error inserting data into MySQL:', err.stack);
//       res.status(500).json({ message: 'Error inserting data into MySQL', error: err });
//     } else {
//       console.log('Data inserted into MySQL with ID:', result.insertId);
//       res.status(200).json({ message: 'JSON object received and data inserted into MySQL', data: receivedData });
//     }
//   });
});

app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('Closing MySQL connection and shutting down gracefully');
  connection.end();
  process.exit(0);
});
