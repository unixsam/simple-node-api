const express = require('express');
const app = express();

app.use(express.json());

const port = process.env.PORT || 3000;

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the Simple Node.js API!' });
});

app.post('/api/data', (req, res) => {
    const data = req.body;
    console.log('Received JSON object:', data);
    res.json({ message: 'JSON object received successfully!', data });
});
  

app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});
