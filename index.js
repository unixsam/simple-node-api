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
  res.json({ message: 'Hello from the Simple Node.js API!' });
});

app.get('/api/last', (req, res) => {
    const query = 'SELECT * FROM sensor_data ORDER BY created_at DESC LIMIT 1';
  
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching last added data:', err.stack);
        res.status(500).json({ message: 'Error fetching last added data', error: err });
      } else {
        res.status(200).json({ message: 'Last added data', data: results[0] });
      }ta
    });
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
  console.log('Received JSON object:', receivedData);

  // Insert data into the MySQL database
  const query = 'INSERT INTO sensor_data (dateTime, temperature, humidity, relay_status) VALUES (?, ?, ?, ?)';
  const values = [receivedData.dateTime, receivedData.temperature, receivedData.humidity, receivedData.relay_status];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error('Error inserting data into MySQL:', err.stack);
      res.status(500).json({ message: 'Error inserting data into MySQL', error: err });
    } else {
      console.log('Data inserted into MySQL with ID:', result.insertId);
      res.status(200).json({ message: 'JSON object received and data inserted into MySQL', data: receivedData });
    }
  });
});



// Add EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', 'views');

// Add a new route to fetch and display the last added data as an HTML page
app.get('/last-added', (req, res) => {
  const query = 'SELECT * FROM sensor_data ORDER BY created_at DESC LIMIT 1';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching last added data:', err.stack);
      res.status(500).render('error', { message: 'Error fetching last added data', error: err });
    } else {
      res.render('last_added', { data: results[0] });
    }
  });
});


app.get('/last-added-10', async (req, res) => {
    try {
      const [rows, _] = await pool.execute('SELECT * FROM sensor_data ORDER BY dateTime DESC LIMIT 10');
      res.render('last_added_data', { data: rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error fetching data from MySQL', error: err });
    }
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
