const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
   name: {
      type: String,
      required: true
   },
   email: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   date: {
      type: Date,
      default: Date.now
   },
   active: {
      type: Boolean,
      required: true,
      default: false
   },
   tempToken: {
      type: String,
      required: false
   },
   resetToken: {
      type: String,
      required: false
   }
});

// model used to interact with the database
module.exports = User = mongoose.model("users", UserSchema);
