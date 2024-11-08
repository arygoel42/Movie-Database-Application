const { Rental, validate } = require("../models/rental");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const { user } = require("../models/user");

const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const routeAuth = require("../middlewear/auth");
const adminCheck = require("../middlewear/auth");
const authLog = require("../middlewear/authLog");

router.get("/", [routeAuth, adminCheck], async (req, res) => {
  //double check this
  //insert admin validation
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

router.post("/getUserRentals", authLog, async (req, res) => {
  const userID = req.user._id;

  let movieArray = [];
  let rentalArray = [];

  const findUser = await user.findOne({
    _id: userID,
  });

  if (!findUser) return res.status(400).send("invalid user");
  for (let i = 0; i < findUser.Rentals.length; i++) {
    const rental = await Rental.findById(findUser.Rentals[i]);
    const movie = await Movie.findById(rental.movie._id);
    movieArray.push(movie);
    rentalArray.push(rental);
  }
  console.log(rentalArray, "rental array");

  res.status(200).json({ rentals: movieArray, rentalObject: rentalArray });
});

router.post("/", authLog, async (req, res) => {
  const userID = req.user._id;
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  const findUser = await user.findOne({ _id: userID });
  if (!findUser) return res.status(400).send("Invalid user.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });
  rental = await rental.save();

  findUser.Rentals.push(rental._id);

  await findUser.save();

  movie.numberInStock--;
  movie.save();

  res.send(rental);
});

router.post("/id", authLog, async (req, res) => {
  const rentalMovieID = req.body.id;

  try {
    const findUser = await user.findOne({ _id: req.user.id }); // Ensure 'User' model is correctly imported

    if (!findUser) return res.status(400).send("Invalid user.");

    // Ensure that Rentals array exists

    // Find all rentals based on the rental IDs in the user's Rentals array
    const rentals = await Rental.find({ _id: { $in: findUser.Rentals } });

    // Find the movie in the rentals
    for (let rental of rentals) {
      if (rental.movie && rental.movie._id.toString() === rentalMovieID) {
        const movie = await Movie.findById(rental.movie._id);
        return res.status(200).send(movie);
      }
    }

    res.status(400).send("Movie not found.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error.");
  }
});

router.post("/processReturn", async (req, res) => {
  const rentalID = req.body.rentalObjectid;

  try {
    const updateUser = await user.findOneAndUpdate(
      { Rentals: rentalID }, // find user with this rental ID in the Rentals array
      {
        $pull: { Rentals: rentalID }, // remove the specific rental ID from the Rentals array
        // set dateReturned to the current timestamp
      },
      { new: true } // return the updated document after modification
    );

    updateUser.save();

    const updateRental = await Rental.findOneAndUpdate(
      { _id: rentalID },
      { dateReturned: new Date() }
    );
    updateRental.save();

    // add logic to set rental fee. by subtracting the dates

    //why is cardNum false --- hash it

    // add infinite scroll //

    if (!updateUser) {
      return res.status(404).json({ message: "User or rental not found" });
    }

    res
      .status(200)
      .json({ message: "Rental removed successfully", user: updateUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error processing request", error: error.message });
  }
});

module.exports = router;
