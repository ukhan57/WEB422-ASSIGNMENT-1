/**********************************************************************************
 *  WEB422 – Assignment 1*
 *  I declare that this assignment is my own work in accordance with Seneca Academic Policy. *
 *  No part of this assignment has been copied manually or electronically from any other source*
 *  (including web sites) or distributed to other students.*
 * 
 *  Name: Umar Khan
 *  Student ID: 145270211
 *  Date: 09/14/2023
 *  Cyclic Link: https://tiny-cyan-bison-tutu.cyclic.app/
 * *********************************************************************************/

// Setup
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const dotenv = require("dotenv").config();
const HTTP_PORT = process.env.PORT || 3000;
// I would like to use port 3000

//Testing
let MONGODB_CONN_STRING= 'mongodb+srv://ukhan57:XaFfpQibJ9KNjdCn@senecaweb.phkxucn.mongodb.net/sample_training';

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

// Ensuring the environment is correct and able to run/test the server locally.
app.get("/", (req,res) => {
    res.json({"message": "API Listening"})
  });

// Add new
// This route uses the body of the request to add a new "Company" document to the collection and return thenewly created company object / fail message to the client.
app.post("/api/companies", (req,res) => {
    res.status(201).json(db.addNewCompany(req.body));
})

// GET all
app.get("/api/companies", (req, res) => {
    const page = parseInt(req.query.page);
    const perPage = parseInt(req.query.perPage);
    const tag = req.query.tag ? req.query.tag.toLowerCase() : null; // Converting tag to lowercase for case-insensitive matching
  
    if (!Number.isInteger(page) || !Number.isInteger(perPage) || page <= 0 || perPage <= 0) {
      return res.status(400).json({ error: "Invalid page or perPage" });
    }
  
    db.getAllCompanies(page, perPage, tag)
      .then((companies) => {
        res.json(companies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({"message": "Server internal error"});
      });
  });
  

// Get One
app.get("/api/company/:name", (req,res) => {
    db.getCompanyByName(req.params.name)
    .then((emp) => {
        emp ? res.json(emp) : res.status(404).json({"message": "Resource not found!"});
    })
    .catch((err) => {
        res.status(500).json({"message": "Server internal error"});
    });
});

// PUT - Edit existing
app.put("/api/company/:name", (req,res) => {
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
db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
   app.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`);
   });
}).catch((err) => {
    console.log(err);
});