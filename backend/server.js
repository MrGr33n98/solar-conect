const express = require('express');
const cors = require('cors');
require('dotenv').config();
const passport = require('passport'); // Require passport itself
require('./config/passport'); // This executes the passport configuration (JwtStrategy)

const app = express();
const port = process.env.PORT || 3001; // Default to 3001 if not in .env

app.use(cors());
app.use(express.json());
app.use(passport.initialize()); // Initialize Passport

// Import routes
const authRoutes = require('./routes/auth');
const companyRoutes = require('./routes/companies');

// Use routes
app.use('/api/users', authRoutes);
app.use('/api/companies', companyRoutes);

// Placeholder API endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running healthy!', timestamp: new Date() });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
