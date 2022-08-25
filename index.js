const express = require('express')
const connectToMongo = require("./db");
const cors = require('cors')

// Establishing connection to database
connectToMongo()


const app = express()
app.use(cors())

const port = 5000
const hostname = 'localhost';

app.use(express.json())

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// Available Routes
// App.use is a middleware that you can handle all requests and pass to. the corresponding router
app.get('/',(req,res)=>{
  res.send("You are on the / welcome")
})
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});