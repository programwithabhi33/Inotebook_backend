const jwt = require("jsonwebtoken")
const fs = require("fs")

// Next means the req attend the fetchuser function and the next function after fetchuser  is called with corresponding req
const fetchuser = (req, res, next) => {
    // get the user id from the json web token and append to the req.body.object
    const token = req.header("auth-token")
    // If token is empty then we return the corresponding response
    if (!token) {
        res.status(401).send({ error: "Access Denied Please authenticate using the valid token" })
    }
    // Reading the secret key from corresponding file
    const secretData = fs.readFileSync("./backend_inotebook/config/secret.config", "utf-8")
    try {
        // Verifying the json web token,first argument of the jwt verify is the user token and the second is the secret key
        const data = jwt.verify(token, secretData)
        
        // Adding the decoded user id from the json web token to the req.user Note: user is a object that we created when the user first sign up
        req.user = data.user
        // Calling the next function means after the fetchuser function will run
        next() 
    }
    catch (error) {
        res.status(401).send({ error: "Access Denied Please authenticate using the valid token" })
    }
}

module.exports = fetchuser
