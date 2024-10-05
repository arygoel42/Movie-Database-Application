const Joi = require("joi");
const mongoose = require("mongoose");
const { genreSchema } = require("./genre");
const { release } = require("os");

const Movie = mongoose.model(
  "Movies",
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },

    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      default: 5,
      min: 0,
      max: 255,
    },
    dailyRentalRate: {
      type: Number,
      default: 2.5,
      min: 0,
      max: 255,
    },
    liked: {
      type: Boolean,
      default: false,
    },
    imageURL: {
      type: String,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isTopRated: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      default: "",
    },
    posterPath: {
      type: String,
      default: "",
    },
    popularity: {
      type: Number,
      default: 0,
    },
    language: {
      type: String,
      default: "",
    },
    releaseDate: {
      type: String,
      default: "",
    },
    runtime: {
      type: Number,
      default: 0,
    },
  })
);

function validateMovie(movie) {
  const schema = {
    title: Joi.string().max(50).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  };

  return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;
