const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
  { username: 'user1', password: 'password1' },
  { username: 'user2', password: 'password2' },
  // Add more users as needed
];

const isValid = (username) => {
  // For simplicity, let's assume any non-empty username is valid
  return !!username;
}

const authenticatedUser = (username, password) => {
  // Check if the provided username and password match any user in the array
  return users.some(user => user.username === username && user.password === password);
}

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check if the username is valid
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username" });
  }

  // Check if the username and password match the records
  if (authenticatedUser(username, password)) {
    // Generate a JWT token with user information
    const token = jwt.sign({ username }, 'your_secret_key', { expiresIn: '1h' });

    return res.status(200).json({ message: "Login successful", token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});

// Add a book review
// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;

  // Check if the book with the given ISBN exists
  if (books[isbn]) {
    // Get the username from the session
    const username = req.user.username;

    // Check if the user has already posted a review for this ISBN
    if (books[isbn].reviews[username]) {
      // Modify the existing review
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review modified successfully" });
    } else {
      // Add a new review
      books[isbn].reviews[username] = review;
      return res.status(200).json({ message: "Review added successfully" });
    }
  } else {
    // If the book is not found, send a 404 status
    return res.status(404).json({ message: "Book not found" });
  }
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;

  const username = req.user.username;

  if (books[isbn]) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      return res.status(404).json({ message: "Review not found for the given ISBN" });
    }
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
