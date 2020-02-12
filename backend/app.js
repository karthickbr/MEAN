const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const postRouters = require('./routes/posts');
const userRouters = require('./routes/user');


var app = express();
// var cors = require('cors');

// mongodb password :   hQXO60PezF3wNkgk
// mongodb username :   mean

// shell command    :   mongo "mongodb+srv://cluster0-ytzpd.mongodb.net/test"  --username mean
// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));

mongoose.connect("mongodb+srv://mean:hQXO60PezF3wNkgk@cluster0-ytzpd.mongodb.net/node-angular?retryWrites=true&w=majority",{ useUnifiedTopology: true ,useNewUrlParser: true })
.then(() => {
  console.log("Connected to Database Successfully...");
})
.catch(() => {
  console.log("Connection Failed...");
})

app.use((req,res,next) => {
  console.log('In The middleware..');
  next();
});

app.use((req,res,next) => {
  res.setHeader("Access-Control-Allow-Origin","*");

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, PATCH, DELETE, OPTIONS"
    );
  next();
});



app.use("/api/posts", postRouters);
app.use("/api/user", userRouters);


module.exports = app;
