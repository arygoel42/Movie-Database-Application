const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const express = require("express");
const users = require("./routes/users");
const app = express();
const Joi = require("joi");
const auth = require("./routes/auth");
Joi.objectId = require("joi-objectid")(Joi);
const cors = require("cors");
const error = require("./middlewear/error");
require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
require("dotenv").config();
const apiScraper = require("./DataScraper/apiScraper");

winston.add(new winston.transports.File({ filename: "logfile.log" }));
winston.add(
  new winston.transports.MongoDB({
    db: "mongodb://localhost/vidly", // MongoDB URI
    collection: "log", // Collection to store logs
    level: "error", // Log only errors (you can change to 'info', 'warn', etc.)
  })
);
app.use(cors());

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/user", users);
app.use("/api/auth", auth);
app.use("/api/apiScraper", apiScraper);

app.use(error);

process.on("uncaughtException", (ex) => {
  winston.error(ex.message, ex);
  process.exit(1);
});

process.on("unhandledRejection", (ex) => {
  winston.error(ex.message, ex);
  process.exit(1);
});

const port = process.env.PORT || 3009;
app.listen(port, () => console.log(`Listening on port ${port}...`));
