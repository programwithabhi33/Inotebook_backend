const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require("fs")
const fetchuser = require("../middleware/fetchuser")

const jwtSecret = "Abhishekisagoodprogr@ammer"

// Route 1:Creating the user using post request no login required
router.post('/createuser', [
  body('name', 'Name value shoud be at least 3 characters').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', "The password must be at least 5 characters long").isLength({ min: 5 })
], async (req, res) => {

  //  Checking the user input name and email and password,when its empty or the above conditons are not satisfied this will execute
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Creating the user in the try block
  try {
    // Checking the user email is alrady exist or not
    let user = await User.findOne({ email: req.body.email })
    // console.log(user)

    // If user alrady exists then we send this error to the user
    if (user) {
      return res.status(400).json({ error: "User with this email alrady exists" })
    }

    // Generating salt in bcryptjs
    let salt = await bcrypt.genSalt(10);

    // Creating hash of password and storing the hash in secPass variable
    let secPass = await bcrypt.hash(req.body.password, salt);

    // When the user email is unique, creating the new user and saving to the corresponding database
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    })

    // Creating the user id object where the jwt used to generate the json web token 
    const data = {
      user: {
        userId: user.id
      }
    }

    const secretData = fs.readFileSync("./backend_inotebook/config/secret.config", "utf-8")

    // Creating JsonWebToken with jwt.sign method
    const authToken = jwt.sign(data, secretData);
    res.json({ authToken })
  }
  catch (err) {
    console.log(err.message)
    res.status(500).send("Something went wrong")
  }

})

// Route 2: Login the user with the user credentials
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', "The password cant be empty").exists()
], async (req, res) => {

  //  Checking the user input email and password,when its empty or the above conditons are not satisfied this will execute
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body

  try {
    // Checking the user email is alrady exist or not
    let user = await User.findOne({ email: req.body.email })
    // console.log(user)

    // If user alrady exists then we send this error to the user
    if (!user) {
      return res.status(400).json({ error: "Please Enter Valid Credentials" })
    }

    // Bcryptjs handle automatic the generated salt so you cannot worry about the where the salt and how to verify it
    // First it take the user password that the user can enter on the password field and the second argument is the passowrd hash in your database
    const passwordCompare = await bcrypt.compare(password, user.password)

    if (!passwordCompare) {
      return res.status(400).json({ error: "Please Enter Valid Credentials" })
    }

    // Creating the user id object where the jwt used to generate the json web token
    const data = {
      user: {
        userId: user.id
      }
    }

    const secretData = fs.readFileSync("./backend_inotebook/config/secret.config", "utf-8")

    // Creating JsonWebToken with jwt.sign method
    const authToken = jwt.sign(data, secretData);
    res.json({ authToken })

  }

  catch (err) {
    console.error(err)
    res.status(500).send("Something went wrong")
  }


})


// Route 3:Get the user details
router.post('/getuser', fetchuser, async (req, res) => {

  try {
    // Destructing the user id from user object 
    const id = req.user.userId

    // Lookup the corresponding user in our database except corresponding user your password
    const user = await User.findById(id).select("-password")
    res.json({ user })
  }

  catch (err) {
    console.error(err)
    res.status(500).send("Something went wrong")
  }
})

module.exports = router