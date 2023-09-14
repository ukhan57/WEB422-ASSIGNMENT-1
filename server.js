/**********************************************************************************
 *  WEB422 – Assignment 1*
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy. *
 *  No part of this assignment has been copied manually or electronically from any other source* (including web sites) or distributed to other students.*
 *  Name: Umar Khan
 *  Student ID: 145270211
 *  Date: 09/14/2023 *
 *  Cyclic Link:
 * *********************************************************************************/

// Setup
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const HTTP_PORT = process.env.PORT || 8080;
// I would like to use port 5000

// Add support for incoming JSON entities
app.use(bodyParser.json());

// Add support for incoming JSON entities
// app.use(bodyParser.json());
app.use(express.json()); // built-in body-parser

// Allow restricted resources on a web page to be requested from another domain.
app.use(cors());

// Add support for requiring ("require") the newly created "companiesDB.js" module as well as create a new "db" instance to work with the data.
const CompaniesDB = require("./modules/companiesDB.js");
const db = new CompaniesDB();

// Deliver the app's home page to browser clients
app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
  });

// Add new
// This route uses the body of the request to add a new "Company" document to the collection and return thenewly created company object / fail message to the client.
app.post("/api/companies", (req,res) => {
    res.status(201).json(db.addNewCompany(req.body));
})

// GET 


// Get One
app.get("/api/company/:name", (req,res) => {
    db.getCompanyByName(req.params.name)
    .then((emp)=> {
        emp ? res.json(emp) : res.status(404).json({"message": "Resource not found!"});
    })
    .catch((err) => {
        res.status(500).json({"message": "Server internal error"});
    });
});

// PUT - Edit existing
app.put("/api/company/:name", (req,res) =>{
    if(req.body.id && req.params.name != req.body.id){
        res.status(400).json({"message": "Names do not match"});
    }
    else {
        let update = db.updateCompanyByName(req.body, req.params.name);
        update ? res.json(update) : res.status(404).json({"message": "Resource not found"});
    }
});

// Delete
app.delete("/api/company/:name", (req,res) => {
    db.deleteCompanyByName(req.params.name);
    res.status(204).end();
});

// Initializing the Module before the server starts to ensure that we can indeed connect to the mongoDB Atlas Cluster
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
    }).catch((err)=>{
        console.log(err);
});