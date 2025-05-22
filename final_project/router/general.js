const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    // Extract username and password from the request body
    const username = req.body.username;
    const password = req.body.password;

    // 1. Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required for registration." });
    }

    // 2. Check if the username already exists using the isValid function
    //    Remember: isValid currently returns true if the username *exists*.
    if (isValid(username)) {
        return res.status(409).json({ message: "Username already exists. Please choose a different one." });
    }

    // 3. If username is valid (doesn't exist), add the new user
    users.push({ username: username, password: password });

    // 4. Send a success response
    return res.status(201).json({ message: "User successfully registered. You can now login." });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    let filtered_books = Object.values(books).filter(book => book.isbn === isbn);
    res.json(filtered_books.length ? filtered_books : { message: "ISBN data not available" });
});

  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let filtered_authors = Object.values(books).filter(book => book.author === author);
    res.send(JSON.stringify(filtered_authors.length ? filtered_authors : { message: "Author not found" }, null, 4));
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let filtered_titles = Object.values(books).filter(book => book.title === title);
    res.send(JSON.stringify(filtered_titles.length ? filtered_titles : { message: "Title not found" }, null, 4));
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "ISBN data was not provided! not my fault :( "});
});

module.exports.general = public_users;
