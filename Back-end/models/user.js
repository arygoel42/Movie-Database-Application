const Joi = require("joi");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { customerSchema } = require("./customer");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
  },
  isAdmin: Boolean,
  Customer: {
    type: customerSchema,
  },
  GoogleID: {
    type: String,
    required: false,
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.PRIVATE_KEY
  );
};

const user = mongoose.model("user", userSchema);

function validateUser(user) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024),
  };

  return Joi.validate(user, schema);
}

exports.user = user;
exports.validateUser = validateUser;
