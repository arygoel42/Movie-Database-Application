const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { user, validateUser } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const routeAuth = require("../middlewear/auth");

router.get("/me", routeAuth, async (req, res) => {
  let User = await findById(req.user._id).select("-password");
  res.send(User);
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
