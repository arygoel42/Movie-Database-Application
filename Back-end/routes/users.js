const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { user, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const routeAuth = require("../middlewear/auth");
const session = require("express-session");
require("../middlewear/Passport");
const passport = require("passport");
const authLog = require("../middlewear/authLog");

router.get("/google/auth", (req, res) => {
  passport.authenticate("google", { scope: ["profile", "email"] })(req, res);
});

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    try {
      res.redirect("http://localhost:5173/");
    } catch (error) {
      console.error("Callback error:", error);
      res.status(500).send("Internal Server Error");
    }
  }
);

router.post("/profile", authLog, async (req, res) => {
  try {
    // Make sure to await the query
    const findUser = await user.findOne({ GoogleID: req.user.GoogleID });

    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user object
    res.json(findUser);
  } catch (error) {
    // Catch any errors and send a 500 response
    console.error("Error finding user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/logout", authLog, async (req, res) => {
  req.logOut((err) => {
    res.status(500).send("error signing out");
  });
});

router.post("/", async (req, res) => {
  //enter validation function

  const { error } = validateUser(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let User = await user.findOne({ email: req.body.email });
  if (User)
    return res.status(400).send("this user has already been registered ");

  User = new user({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(User.password, salt);
  User.password = hashed;
  const result = await User.save();
  const token = User.generateAuthToken();
  res.header("x-auth-token", token).send(result);
});

module.exports = router;
