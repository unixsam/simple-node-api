const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the Simple Node.js API!' });
});

app.listen(port, () => {
  console.log(`API is running on port ${port}`);
});
