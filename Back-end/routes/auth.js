const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { user } = require("../models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();

const jwtA = process.env.PRIVATE_KEY;

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).json(error.details[0].message);

  let authUser = await user.findOne({ email: req.body.email });
  if (!authUser) return res.status(400).json("invalid email or password");

  const validUser = await bcrypt.compare(req.body.password, authUser.password);
  if (!validUser) return res.status(400).json("invalid email or password");

  const token = authUser.generateAuthToken();

  res.header("x-auth-token", token).json(token);
  console.log(token);

  //authentication parameters

  //bcrypt check
});

async function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  };

  return Joi.validate(req, schema);
}

module.exports = router;
