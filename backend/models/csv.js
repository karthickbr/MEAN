const mongoose = require("mongoose");

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

module.exports = mongoose.model('csvData', csvSchema);
