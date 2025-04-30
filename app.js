const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Session configuration
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Dummy user data
const USER = {
  username: 'aishwarya',
  password: '1234'
};

// Routes

// Root route - check session and redirect accordingly
app.get('/', (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  } else {
    res.redirect('/login.html');
  }
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === USER.username && password === USER.password) {
    req.session.user = username;
    req.session.cart = [];
    res.send(`<script>window.location.href = '/';</script>`);
  } else {
    res.send(`<script>alert("Invalid credentials"); window.location.href="/login.html";</script>`);
  }
});

// Add item to cart
app.post('/cart/add', (req, res) => {
  if (!req.session.user) return res.status(401).send('Please login first');
  const { item } = req.body;
  req.session.cart.push(item);
  res.send('Item added to cart');
});

// View cart
app.get('/cart', (req, res) => {
  if (!req.session.user) return res.status(401).send('Please login first');
  res.json({ cart: req.session.cart });
});

// Logout
app.post('/logout', (req, res) => {
  req.session.destroy();
  res.send('Logged out successfully');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
