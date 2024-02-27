const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  // Register User
  public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if both username and password are provided
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    if (users[username]) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Store the user in the users object
    users[username] = { username, password };

    return res.status(201).json({ message: "User registered successfully" });
  });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  const booksArray = Object.values(books);

  // Use JSON.stringify for displaying the output neatly
  const booksJSON = JSON.stringify(booksArray, null, 2);

  // Send the response
  return res.status(200).send(booksJSON);
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const { isbn } = req.params;

  // Check if the book with the given ISBN exists
  if (books[isbn]) {
    // Use JSON.stringify for displaying the output neatly
    const bookJSON = JSON.stringify(books[isbn], null, 2);

    // Send the response
    return res.status(200).send(bookJSON);
  } else {
    // If the book is not found, send a 404 status
    return res.status(404).json({ message: "Book not found" });
  }
  return res.status(300).json({ message: "Yet to be implemented" });
});

public_users.get("/author/:author", function (req, res) {
  try {
    const author = req.params.author.toLowerCase(); // Convert to lowercase for case-insensitive comparison

    // Get books with matching author
    const booksByAuthor = Object.entries(books)
      .filter(([isbn, book]) => book.author.toLowerCase() === author)
      .reduce((acc, [isbn, book]) => {
        acc[isbn] = book;
        return acc;
      }, {});

    if (Object.keys(booksByAuthor).length === 0) {
      return res
        .status(404)
        .json({ error: "No books found for the given author." });
    }

    return res.status(200).json({ books: booksByAuthor });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.toLowerCase();

  // Get books with matching title
  const booksByTitle = Object.entries(books)
    .filter(([isbn, book]) => book.title.toLowerCase().includes(title))
    .reduce((acc, [isbn, book]) => {
      acc[isbn] = book;
      return acc;
    }, {});

  if (Object.keys(booksByTitle).length === 0) {
    return res
      .status(404)
      .json({ error: "No books found for the given title." });
  }

  return res.status(200).json({ books: booksByTitle });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;

  // Check if the book with the given ISBN exists
  if (books[isbn] && books[isbn].reviews) {
    // Get the book reviews
    const reviews = books[isbn].reviews;

    return res.status(200).json({ reviews });
  } else {
    // If the book is not found or has no reviews, send a 404 status
    return res
      .status(404)
      .json({ message: "Book not found or no reviews available" });
  }
});

module.exports.general = public_users;
