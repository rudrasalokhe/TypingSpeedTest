const express = require('express');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// In-memory "database" for demonstration purposes
let users = [];

// Register Route
app.post(
  '/register',
  [
    // Validate and sanitize input
    body('username').isLength({ min: 3 }).trim().escape(),
    body('password').isLength({ min: 6 }).trim().escape(),
    body('email').isEmail().normalizeEmail()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, email } = req.body;

    // Check if user already exists
    const userExists = users.find(user => user.email === email);
    if (userExists) {
      return res.status(400).json({ message: 'User already exists!' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to "database"
    users.push({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully!' });
  }
);

// Login Route
app.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }).trim().escape()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.status(200).json({ message: 'Login successful!' });
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
