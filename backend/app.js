const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var app = express();
// var cors = require('cors');
var Post = require("./models/post");
// mongodb password   :  hQXO60PezF3wNkgk
// mongodb username : mean
// shell command :   mongo "mongodb+srv://cluster0-ytzpd.mongodb.net/test"  --username mean
// app.use(cors());
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

  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
    );

  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, PATCH, DELETE, OPTIONS"
    );
  next();
});

app.post('/api/posts',(req, res, next) => {
//const post = req.body;
const post = new Post({
  title: req.body.title,
  content: req.body.content
})
console.log(post);
post.save().then(createdPost => {
console.log(createdPost);
  res.status(201).json({
    message: "Post Added Successfully...",
    postId: createdPost._id
  });

});

});

app.put('/api/posts/:id',(req,res,next) => {
  const post = new Post ({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id:req.params.id}, post).then(result => {
    console.log(result);
    res.status(200).json({message: 'Post Updated Successfully'});
  })
})

app.get('/api/posts',(req, res,next) => {
Post.find()
.then(documents => {
  res.status(200).json({
    message: "The Post Fetched Succesfully",
    posts: documents
    });
  });
});

app.delete('/api/posts/:id',(req,res,next) => {
  Post.deleteOne({_id:req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({
      message: "Deleted Successfully..."
    });
  });
});

module.exports = app;
