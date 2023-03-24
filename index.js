const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Use body-parser middleware to parse JSON data
app.use(bodyParser.json());

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the Simple Node.js API!' });
});

// Add a POST route to handle incoming JSON objects
app.post('/api', (req, res) => {
  const receivedData = req.body;
  console.log('Received JSON object:', receivedData);
  res.status(200).json({ message: 'JSON object received', data: receivedData });
});

app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});
