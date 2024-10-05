const jwt = require("jsonwebtoken");
require("dotenv").config();

function routeAuth(req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access denied, no token provided");

  try {
    const decoded = jwt.verify(token, process.env.PRIVATE_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("invalid token");
  }
}

module.exports = routeAuth;
