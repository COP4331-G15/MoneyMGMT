const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Create Schema 

const UserSchema = mongoose.Schema({
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
      }
});

// model used to interact with the database 
module.exports = User = mongoose.model("users", UserSchema);