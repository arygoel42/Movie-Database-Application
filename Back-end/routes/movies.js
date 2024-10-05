const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const routeAuth = require("../middlewear/auth");
const adminCheck = require("../middlewear/auth");

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name").limit(10);
  res.send(movies);
});

router.get("/popular", async (req, res) => {
  const popularMovies = await Movie.find({ isPopular: true }).sort("name");
  res.send(popularMovies);
});

router.get("/toprated", async (req, res) => {
  const topRatedMovies = await Movie.find({ isTopRated: true }).sort("name");
  res.send(topRatedMovies);
});

router.get("/genre/:genre", async (req, res) => {
  const getByGenre = await Movie.find({ "genre.name": req.params.genre }).limit(
    15
  );
  res.send(getByGenre);
});

router.get("/search/:searchQuery", async (req, res) => {
  const getBySearch = await Movie.find({
    title: { $regex: req.params.searchQuery, $options: "i" },
  }).limit(10);
  res.send(getBySearch);
});

router.post("/", [routeAuth, adminCheck], async (req, res) => {
  //insert admin validation
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);

  if (!genre) return res.status(400).send("Invalid genre.");

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  movie = await movie.save();

  res.send(movie);
});

router.put("/:id", [routeAuth, adminCheck], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre.");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

router.delete("/:id", [routeAuth, adminCheck], async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(movie);
});

router.get("/:id", async (req, res) => {
  const getMovie = await Movie.findById(req.params.id);

  if (!getMovie)
    return res.status(404).send("The movie with the given ID was not found.");

  res.send(getMovie);
});

module.exports = router;
