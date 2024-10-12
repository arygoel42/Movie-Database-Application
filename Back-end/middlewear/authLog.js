const passport = require("passport");
require("../middlewear/Passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();

function authLog(req, res, next) {
  const token = req.header("x-auth-token");
  console.log("helloWorld");
  //   console.log(token + " token");

  if (req.isAuthenticated()) {
    return next();
  } else if (token) {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).send("Access denied, no token provided");

    try {
      const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
      console.log(decoded);
      req.user = decoded;
      next();
    } catch (ex) {
      res.status(400).send("invalid token");
    }
  } else {
    res.status(401).send("access denied");
  }
}

module.exports = authLog;
