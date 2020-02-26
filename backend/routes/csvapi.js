const express = require('express');
const router = express.Router();
const fs = require('fs');
const mongoose = require("mongoose");
// const csvCollection = require("../models/csv");
var csvParser = require('csv-parse');


var csvfile = __dirname + "/UserSample.csv";



// router.post('/csvData', (req, res, next) => {

//   var csv = new csvCollection();


//   fs.readFile(csvfile , function(err, csvData) {
//     if (err) {
//         console.log(err);
//     }
//     csvParser(csvData, { delimiter: ',' }, function(err, data) {
//         if (err) {
//              console.log(err);
//         } else {
//              console.log("Data", data);

//             csvCollection.insertMany(data, (err, upData) => {
//               if(err) {
//               console.log("err", err);
//               }
//               else {
//               console.log("Multiple documents inserted to Collection");
//               }
//             });
//         }
//     });
// });
// });


router.post('/csvData', (req, res, next) => {

var lineList = fs.readFileSync(csvfile).toString().split('\n');
lineList.shift(); // Shift the headings off the list of records.

var schemaKeyList = ['UserName', 'FirstName', 'LastName', 'DisplayName', 'JobTitle', "Department", "OfficePhone",
"MobilePhone", "Fax", 'Address', 'City', 'State', 'ZIP', 'Country'];

const csvSchema = new mongoose.Schema({
  UserName:{
    type: String
  },
  FirstName: {
    type: String
  },
  LastName: {
    type: String
  },
  DisplayName: {
    type: String
  },
  JobTitle: {
    type: String
  },
  Department: {
    type: String
  },
  OfficePhone: {
    type: String
  },
  MobilePhone: {
    type: String
  },
  Fax: {
    type: String
  },
  Address: {
    type: String
  },
  City: {
    type: String
  },
  State: {
    type: String
  },
  ZIP: {
    type: Number
  },
  Country: {
    type: String
  }
});

var RepOppDoc = mongoose.model('csvData', csvSchema);


function queryAllEntries () {
  RepOppDoc.aggregate([
      {$group: {_id: '$FirstName',

              oppArray: {$push: {
                LastName: '$LastName',
                DisplayName: '$DisplayName',
                JobTitle: '$JobTitle',
                Department: '$Department',
                OfficePhone: '$OfficePhone',
                MobilePhone: '$MobilePhone',
                Fax: '$Fax',
                Address: '$Address',
                City: '$City',
                State: '$State',
                ZIP: '$ZIP',
                Country: '$Country'
              }}
              } }, (function(err, qDocList) {
        // console.log(util.inspect(qDocList, false, 10));
        process.exit(0);
    })]);
}

function createDocRecurse (err) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    if (lineList.length) {
        var line = lineList.shift();
        var doc = new RepOppDoc();
        line.split(',').forEach(function (entry, i) {
            doc[schemaKeyList[i]] = entry;
        });
        doc.save(createDocRecurse)
    } else {
        // After the last entry query to show the result.
        queryAllEntries();
    }
}

createDocRecurse(null);


 });

module.exports = router;
