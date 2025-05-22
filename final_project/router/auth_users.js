const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    // Extract username and password from the request body
    const username = req.body.username;
    const password = req.body.password;

    // 1. Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // 2. Authenticate the user
    if (authenticatedUser(username, password)) {
        // User is authenticated, generate a JWT
        // The secret key 'access' should match the one used in index.js for verification
        let accessToken = jwt.sign({ data: username }, "access", { expiresIn: 60 * 60 }); // Token expires in 1 hour

        // Save the access token in the session
        // req.session.authorization needs to be initialized if it doesn't exist
        if (!req.session.authorization) {
            req.session.authorization = {};
        }
        req.session.authorization.accessToken = accessToken;
        req.session.authorization.username = username; 

        return res.status(200).json({ message: "User successfully logged in", accessToken: accessToken });
    } else {
        // Authentication failed
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
