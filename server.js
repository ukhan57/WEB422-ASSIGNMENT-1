// Setup
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const dotenv = require("dotenv")
const mongo = require("mongoose")
const HTTP_PORT = process.env.PORT || 5000;
// I would like to use port 5000

// Add support for incoming JSON entities
app.use(bodyParser.json());

// Add support for incoming JSON entities
// app.use(bodyParser.json());
app.use(express.json()); // built-in body-parser

app.use(cors());

// Deliver the app's home page to browser clients
app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '/index.html'));
    res.json({message: "API Listening"})
});


// Tell the app to start listening for requests
app.listen(HTTP_PORT, () => {
  console.log('Ready to handle requests on port ' + HTTP_PORT);
});