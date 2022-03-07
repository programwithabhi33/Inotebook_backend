const express = require('express')
const connectToMongo = require("./db");

// Establishing connection to database
connectToMongo()


const app = express()
const port = 5000

app.use(express.json())

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// Available Routes
// App.use is a middleware that you can handle all requests and pass to the corresponding router
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})