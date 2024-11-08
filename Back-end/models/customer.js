const Joi = require("joi");
const number = require("joi/lib/types/number");
const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  CardNum: {
    type: Number,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
});
const Customer = mongoose.model("Customer", customerSchema);

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    CardNum: Joi.required(),
    phone: Joi.string().min(5).max(50).required(),
  };

  return Joi.validate(customer, schema);
}
exports.customerSchema = customerSchema;
exports.Customer = Customer;
exports.validate = validateCustomer;
