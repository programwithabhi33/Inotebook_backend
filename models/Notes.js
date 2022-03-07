const mongoose = require('mongoose');
const { Schema } = mongoose;

// Defining the notes schema
const notesSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default:"General"
    },
    date: {
        type: Date,
        // Dont the give the like Date.now() that it means default is the Date.now function
        default: Date.now
    }
});

module.exports = mongoose.model('notes',notesSchema)