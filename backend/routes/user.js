const express  = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require("bcrypt");


router.post('/signup', (req, res, next) => {

  bcrypt.hash(req.body.password, 10).then(hash => {

    var user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash
    });
    user.save().then(result => {
      res.status(201).json({message: "User Created", result: result});
    })
  }).catch(err => {
    // console.log(err);
    res.status(500).json({error: err})
  });

});



module.exports = router;
