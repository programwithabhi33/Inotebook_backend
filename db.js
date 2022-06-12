const mongoose = require('mongoose')

// Your locally database url that you can use to connect the database
const mongoURI = 'mongodb://localhost:27017/inotebook'


const connectToMongo=()=>{
    // mongoose.connect is a function that connects mongodb database it take first database url argument and second is callback when the connection is established the callback is fired
    mongoose.connect(mongoURI,()=>{
        console.log("Connected to mongose succefully")
    })
}

module.exports = connectToMongo