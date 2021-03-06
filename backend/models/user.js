const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");  // is an plugin for validator

const userSchema = new mongoose.Schema({
  name: { type: String , required: true },
  email: { type: String , required: true, unique: true},
  password: { type: String , required:true}
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);
