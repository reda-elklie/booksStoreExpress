const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

// Use extended: true for urlencoded middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/customer", session({ secret: "fingerprint_customer", resave: true, saveUninitialized: true }));

// Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
  // Write the authentication mechanism here
  next();
});

// Login route in authenticated router
customer_routes.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check username and password, generate JWT, and handle the login logic
  // For simplicity, let's assume a predefined user with username "user" and password "password"
  if (username === 'user' && password === 'password') {
    const token = jwt.sign({ username }, 'your_secret_key', { expiresIn: '1h' });
    res.status(200).json({ message: "Login successful", token });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running on port", PORT));
