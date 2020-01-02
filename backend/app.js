const express = require('express');
var app = express();

app.use((req,res,next) => {
  console.log('In The middleware..');
  next();
});

app.use((req,res,next) => {

  res.setHeaders("Access-Control-Allow-Origin","*");
  res.setHeaders("Access-Control-Allow-Header");
  res.setHeaders();

  next();
})

app.use('/api/posts',(req, res,next) => {

  const posts = [
  {
    id: "djfghdj",
    title: "My First Post",
    content: "This Post from server..."
 },
 {
  id: "dfdsfsgg",
  title: "My Second Post",
  content: "This Post from server Side..."
},
{
  id: "tertert",
  title: "My Third Post",
  content: "This Third Post from server Side..."
}
];

res.status(200).json({
  mesage:"The Post Fetched Succesfully",
  data:posts
  });
});

module.exports = app;
