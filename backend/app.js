const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var app = express();
var Post = require("./models/post");
// mongodb password   :  hQXO60PezF3wNkgk
// mongodb username : mean
// shell command :   mongo "mongodb+srv://cluster0-ytzpd.mongodb.net/test"  --username mean

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

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
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods","POST, GET, PUT, PATCH, DELETE, OPTIONS");
  next();
});

app.post('/api/posts',(req, res, next) => {
//const post = req.body;
const post = new Post({
  title: req.body.title,
  content: req.body.content
})
console.log(post);
post.save();
res.status(201).json({
  message: "Post Added Successfully..."
});
});

app.get('/api/posts',(req, res,next) => {
//   const posts = [
//  {
//     id: "djfghdj",
//     title: "My First Posts",
//     content: "This Post from server..."
//  },
//  {
//   id: "dfdsfsgg",
//   title: "My Second Posts",
//   content: "This Post from server Side..."
// },
// {
//   id: "tertert",
//   title: "My Third Posts",
//   content: "This Third Post from server Side..."
// }
// ];

Post.find()
.then(documents => {
  res.status(200).json({
    message: "The Post Fetched Succesfully",
    posts: documents
    });
  })
});

module.exports = app;
