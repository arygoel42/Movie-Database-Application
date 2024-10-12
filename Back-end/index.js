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
require("./middlewear/Passport");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const path = require("path");
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const corsOptions = {
  origin: "http://localhost:5173", // Change to your frontend URL
  credentials: true, // Allow credentials
  exposedHeaders: ["x-auth-token"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // Your frontend origin
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-auth-token"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

app.use(
  session({
    secret: process.env.PRIVATE_KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: "mongodb://localhost/vidly" }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

winston.add(new winston.transports.File({ filename: "logfile.log" }));
winston.add(
  new winston.transports.MongoDB({
    db: "mongodb://localhost/vidly", // MongoDB URI
    collection: "log", // Collection to store logs
    level: "error", // Log only errors (you can change to 'info', 'warn', etc.)
  })
);

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

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
