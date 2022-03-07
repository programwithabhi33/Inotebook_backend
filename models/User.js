const mongoose = require('mongoose');
const { Schema } = mongoose;

// Defining the user schema
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        // Dont the give the like Date.now() that it means default is the Date.now function
        default: Date.now
    }
});
module.exports = mongoose.model('user',userSchema)