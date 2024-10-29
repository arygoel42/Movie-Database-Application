const { Movie, validate } = require("../models/movie");
const { user } = require("../models/user");
const { Genre } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const routeAuth = require("../middlewear/auth");
const adminCheck = require("../middlewear/auth");
const authLog = require("../middlewear/authLog");
const { route } = require("./users");

router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name").limit(10);
  res.send(movies);
});

router.post("/addWatchList", authLog, async (req, res) => {
  const movieid = req.body.id;
  const userid = req.user._id;

  try {
    const findUser = await user.findOne({ _id: userid });
    if (!findUser) return res.status(404).send("user object not returned");
    const findMovie = await Movie.findOne({ _id: movieid });
    if (!findMovie) return res.status(404).send("movie object not found");

    if (findUser.watchList.includes(movieid)) {
      return;
    }

    findUser.watchList.push(findMovie._id);
    await findUser.save();
    res.status(200).json({ movieObject: findMovie });
  } catch (error) {
    res.status(500).send("unknown error:", error.message);
  }
});

router.post("/removeWatchList", authLog, async (req, res) => {
  const movieid = req.body.id;
  const userid = req.user._id;

  try {
    const findUser = await user.findOne({
      _id: userid,
    });

    const findMovie = await Movie.findOne({
      _id: movieid,
    });

    if (!findMovie) return res.status(404).send("movie object not found");
    if (!findUser) return res.status(404).send("user object not returned");

    findUser.watchList.pull(findMovie._id);

    await findUser.save();

    res.status(200).send("Movie successfully removed from watchlist");
  } catch (error) {
    res.status(500).send("unknow error:", error.message);
  }
});

router.post("/checkWatchList", authLog, async (req, res) => {
  const userid = req.user._id; // Get the user's ID from the request object

  try {
    let movieArray = [];
    // Find the user by ID
    const findUser = await user.findOne({ _id: userid });
    if (!findUser) return res.status(400).send("User object not found");

    for (let i = 0; i < findUser.watchList.length; i++) {
      let findMovie = await Movie.findOne({
        _id: findUser.watchList[i],
      });

      if (findMovie) {
        movieArray.push(findMovie);
      }
    }

    // Return the user's watchList array
    res.status(200).json({ watchList: movieArray });
  } catch (error) {
    console.error("Error retrieving watchList:", error);
    res.status(500).send("Unknown error: " + error.message);
  }
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
