const express = require('express');
const router = express.Router();
const fs = require('fs');
const mongoose = require("mongoose");
const csvCollection = require("../models/csv");
var csvParser = require('csv-parse');

// let filePath = require("../middleware/UserSample.csv");
var csvfile = __dirname + "/UserSample.csv";

//var stream = fs.createReadStream(csvfile);

router.post('/csvData', (req, res, next) => {

  var csv = new csvCollection();
  var uploadcsv = [];

  fs.readFile(csvfile , function(err, csvData) {
    if (err) {
        console.log(err);
    }
    csvParser(csvData, { delimiter: ',' }, function(err, data) {
        if (err) {
            console.log(err);
        } else {
            console.log("Data", data);
            var jsonString = JSON.stringify(data);
            console.log("json", jsonString);

            csvCollection.insertMany(jsonString, (err, upData) => {
              if(err) {
                console.log("err", err);
              }
              else {
                console.log("Multiple documents inserted to Collection");
              }
            });
        }
    });
});
});



module.exports = router;
