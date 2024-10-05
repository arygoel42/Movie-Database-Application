const winston = require("winston");
function errorHandler(err, req, res, next) {
  winston.error(err.message, err);
  res.status(500).send("something failed");
}

module.exports = errorHandler;
