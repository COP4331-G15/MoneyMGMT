const mongoose = require('mongoose');

// blueprint 

const ThoughtSchema = mongoose.Schema({
    thought: String,
    dateCreated: Date,
});

// model used to interact with the database 
const Thought = mongoose.model('Thought', ThoughtSchema);

module.exports = Thought;