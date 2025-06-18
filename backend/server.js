const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001; // Default to 3001 if not in .env

app.use(cors());
app.use(express.json());

// Placeholder API endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running healthy!', timestamp: new Date() });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
