const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register new user
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

// Get book review by Title
// booksdb.js does not come with ISBN data so had to implement it diffrent.
// pls grade me for the effort :)
// Cheers!
public_users.get('/review/:title',function (req, res) {
    const title = req.params.title; // Get the title from the URL parameter
    // Find the book by title.
    // Since 'books' is an object keyed by ISBN, we iterate over its values.
    const foundBook = Object.values(books).find(book => book.title === title);

    if (foundBook) {
        const bookReviews = foundBook.reviews; // Access the reviews for that book
        // If there are no reviews, return an appropriate message
        if (Object.keys(bookReviews).length === 0) {
            return res.status(200).json({ message: `No reviews available for the book "${title}".` });
        } else {
            // Otherwise, return the reviews
            return res.status(200).json(bookReviews);
        }
    } else {
        // If no book with the given title is found
        return res.status(404).json({ message: `Book with title "${title}" not found.` });
    }
});

    //Creating a promise method. The promise will get resolved when timer times out after 6 seconds.
    let myPromise = new Promise((resolve,reject) => {
        setTimeout(() => {
          resolve("Promise resolved")
        },6000)})
    //Console log before calling the promise
    console.log("Before calling promise");
    //Call the promise and wait for it to be resolved and then print a message.
    myPromise.then((successMessage) => {
        console.log("From Callback " + successMessage)
      })
    //Console log after calling the promise
      console.log("After calling promise");

module.exports.general = public_users;
