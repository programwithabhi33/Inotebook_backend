const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');

// Creating the user using post request no login required
router.post('/createuser',[
    body('name','Name value shoud be at least 3 characters').isLength({ min: 3 }),
    body('email','Enter a valid email').isEmail(),
    body('password',"The password must be at least 5 characters long").isLength({ min: 5 })
],async(req,res)=>{
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try{
    let user = await User.findOne({email:req.body.email})
    // console.log(user)
    if(user){
        return res.status(400).json({error:"User with this email alrady exists"})
    }


    user =  await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
      })
    //   .then(user => res.json(user))
    //   .catch(err=> {
    //       console.log(err)
    //       res.json({error:"Please enter the unique valu at the eamil",error:err.message})
    res.json(user)
    }
    catch(err){
      console.log(err.message)
      res.status(500).send("Something went wrong")
    }
    // res.json(user)
    
})

module.exports = router