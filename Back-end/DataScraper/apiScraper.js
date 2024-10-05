const { Movie, validate } = require("../models/movie");
const { Genre } = require("../models/genre");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const routeAuth = require("../middlewear/auth");
const adminCheck = require("../middlewear/auth");

const axios = require("axios");

router.get("/", async (req, res) => {
  const genreObject = [
    {
      name: "Action",
      _id: "28",
    },
    {
      name: "Adventure",
      _id: "12",
    },
    {
      name: "Comedy",
      _id: "35",
    },
    {
      name: "Drama",
      _id: "18",
    },
    {
      name: "Horror",
      _id: "27",
    },
    {
      name: "Science Fiction",
      _id: "878",
    },
    {
      name: "Fantasy",
      _id: "14",
    },
    {
      name: "Thriller",
      _id: "53",
    },
    {
      name: "Mystery",
      _id: "9648",
    },
    {
      name: "Romance",
      _id: "10749",
    },
    {
      name: "Animation",
      _id: "16",
    },
    {
      name: "Documentary",
      _id: "99",
    },
    {
      name: "Crime",
      _id: "80",
    },
    {
      name: "Musical",
      _id: "10402",
    },
    {
      name: "War",
      _id: "10752",
    },
    {
      name: "Western",
      _id: "37",
    },
    {
      name: "Historical",
      _id: "36",
    },
    {
      name: "Biographical",
      _id: "18",
    },
    {
      name: "Family",
      _id: "10751",
    },
    {
      name: "Sports",
      _id: "21",
    },
    {
      name: "Superhero",
      _id: "878",
    },
    {
      name: "Noir",
      _id: "80",
    },
    {
      name: "Psychological Thriller",
      _id: "53",
    },
    {
      name: "Disaster",
      _id: "27",
    },
    {
      name: "Suspense",
      _id: "9648",
    },
    {
      name: "Slasher",
      _id: "27",
    },
    {
      name: "Period Piece",
      _id: "36",
    },
    {
      name: "Coming-of-Age",
      _id: "35",
    },
    {
      name: "Dystopian",
      _id: "878",
    },
    {
      name: "Martial Arts",
      _id: "28",
    },
  ];

  const pages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  async function getMovies(genreObject, pages) {
    try {
      for (let i = 0; i < 900; i++) {
        let randomGenre =
          genreObject[Math.floor(Math.random() * genreObject.length)];
        let randomPage = pages[Math.floor(Math.random() * pages.length)];
        let response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.MOVIE_KEY}&with_genres=${randomGenre._id}&page=${randomPage}`
        );
        if (
          response.data &&
          response.data.results &&
          response.data.results.length > 0
        ) {
          let movies = response.data.results;
          let randomMovie = movies[Math.floor(Math.random() * movies.length)];
          if (
            (randomMovie && randomMovie.original_title) ||
            randomMovie.title
          ) {
            let movieCheck = await Movie.findOne({
              title: randomMovie.title || randomMovie.original_title,
            });
            if (!movieCheck) {
              let genreMovie = await Genre.findOne({ name: randomGenre.name });
              if (genreMovie) {
                let movie = new Movie({
                  title: randomMovie.original_title || randomMovie.title,
                  genre: {
                    _id: genreMovie._id,
                    name: genreMovie.name,
                  },
                  imageURL: `https://image.tmdb.org/t/p/w500${randomMovie.poster_path}`,
                  description: randomMovie.overview,
                  budget: randomMovie.budget,
                  popularity: randomMovie.popularity,
                  releaseDate: randomMovie.release_date,
                  runtime: randomMovie.runtime,
                  language: randomMovie.language,
                  posterPath: randomMovie.poster_path,
                });
                movie = await movie.save();
              }
            }
          }
        }
      }
    } catch (err) {
      throw new Error("Error fetching or saving movies: " + err.message);
    }
  }

  try {
    getMovies(genreObject, pages);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.get("/popular", async (req, res) => {
  const genreObject = [
    { name: "Action", _id: "28" },
    { name: "Adventure", _id: "12" },
    { name: "Comedy", _id: "35" },
    { name: "Drama", _id: "18" },
    { name: "Horror", _id: "27" },
    { name: "Science Fiction", _id: "878" },
    { name: "Fantasy", _id: "14" },
    { name: "Thriller", _id: "53" },
    { name: "Mystery", _id: "9648" },
    { name: "Romance", _id: "10749" },
    { name: "Animation", _id: "16" },
    { name: "Documentary", _id: "99" },
    { name: "Crime", _id: "80" },
    { name: "Musical", _id: "10402" },
    { name: "War", _id: "10752" },
    { name: "Western", _id: "37" },
    { name: "Historical", _id: "36" },
    { name: "Biographical", _id: "18" },
    { name: "Family", _id: "10751" },
    { name: "Sports", _id: "21" },
    { name: "Superhero", _id: "878" },
    { name: "Noir", _id: "80" },
    { name: "Psychological Thriller", _id: "53" },
    { name: "Disaster", _id: "27" },
    { name: "Suspense", _id: "9648" },
    { name: "Slasher", _id: "27" },
    { name: "Period Piece", _id: "36" },
    { name: "Coming-of-Age", _id: "35" },
    { name: "Dystopian", _id: "878" },
    { name: "Martial Arts", _id: "28" },
  ];

  try {
    let response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.MOVIE_KEY}&language=en-US&page=1`
    );

    if (
      response.data &&
      response.data.results &&
      response.data.results.length > 0
    ) {
      for (let i = 0; i < response.data.results.length; i++) {
        const movie = response.data.results[i];
        const movieTitle = movie.original_title || movie.title;

        // Only proceed if there's a title
        if (movieTitle) {
          const movieGenreId = movie.genre_ids[1]; // Check if this index is always valid
          let movieGenreName = null;

          // Find the genre name from the local genreObject
          for (let genre of genreObject) {
            if (genre._id === movieGenreId.toString()) {
              movieGenreName = genre.name;
              break;
            }
          }

          // If a valid genre name is found
          if (movieGenreName) {
            let movieGenre = await Genre.findOne({ name: movieGenreName });

            if (!movieGenre) {
              console.log(`Genre not found in DB for: ${movieGenreName}`);
              res.send("Error fetching or saving movies.");
              continue; // Skip this movie if genre is not found
            }
            let movieCheck = await Movie.findOne({
              title: movie.original_title,
            });
            if (movieCheck) continue;

            // Save the popular movie with the found genre
            let popularMovie = new Movie({
              title: movieTitle,
              genre: {
                name: movieGenre.name,
                _id: movieGenre._id,
              },
              imageURL: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
              isPopular: true,
              description: movie.overview,
              budget: movie.budget,
              popularity: movie.popularity,
              releaseDate: movie.release_date,
              runtime: movie.runtime,
              language: movie.language,
              posterPath: movie.poster_path,
            });

            await popularMovie.save();
          } else {
            console.log(`Genre not found for ID: ${movieGenreId}`);
          }
        }
      }
    }

    res.send("Movies fetched and saved successfully!");
  } catch (error) {
    console.error("Error fetching or saving movies:", error);
    res.status(500).send("Error fetching or saving movies.");
  }
});

router.get("/toprated", async (req, res) => {
  const genreObject = [
    { name: "Action", _id: "28" },
    { name: "Adventure", _id: "12" },
    { name: "Comedy", _id: "35" },
    { name: "Drama", _id: "18" },
    { name: "Horror", _id: "27" },
    { name: "Science Fiction", _id: "878" },
    { name: "Fantasy", _id: "14" },
    { name: "Thriller", _id: "53" },
    { name: "Mystery", _id: "9648" },
    { name: "Romance", _id: "10749" },
    { name: "Animation", _id: "16" },
    { name: "Documentary", _id: "99" },
    { name: "Crime", _id: "80" },
    { name: "Musical", _id: "10402" },
    { name: "War", _id: "10752" },
    { name: "Western", _id: "37" },
    { name: "Historical", _id: "36" },
    { name: "Biographical", _id: "18" },
    { name: "Family", _id: "10751" },
    { name: "Sports", _id: "21" },
    { name: "Superhero", _id: "878" },
    { name: "Noir", _id: "80" },
    { name: "Psychological Thriller", _id: "53" },
    { name: "Disaster", _id: "27" },
    { name: "Suspense", _id: "9648" },
    { name: "Slasher", _id: "27" },
    { name: "Period Piece", _id: "36" },
    { name: "Coming-of-Age", _id: "35" },
    { name: "Dystopian", _id: "878" },
    { name: "Martial Arts", _id: "28" },
  ];

  try {
    let response = await axios.get(
      `https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.MOVIE_KEY}&language=en-US&page=1`
    );

    if (
      response.data &&
      response.data.results &&
      response.data.results.length > 0
    ) {
      for (let movie of response.data.results) {
        const movieTitle = movie.original_title || movie.title;

        if (movieTitle) {
          const movieGenreId = movie.genre_ids[0]; // Assuming the first genre ID is the main one
          let movieGenreName = null;

          // Find the genre name using the genre ID
          for (let genre of genreObject) {
            if (genre._id === movieGenreId.toString()) {
              movieGenreName = genre.name;
              break;
            }
          }

          // Only proceed if a genre name is found
          if (movieGenreName) {
            let movieGenre = await Genre.findOne({ name: movieGenreName });

            if (!movieGenre) {
              console.log(`Genre not found in DB for: ${movieGenreName}`);
              continue; // Skip this movie if genre is not found
            }

            let movieCheck = await Movie.findOne({
              title: movie.original_title,
            });
            if (movieCheck) continue;

            // Create and save the top-rated movie
            let topRatedMovie = new Movie({
              title: movieTitle,
              genre: {
                name: movieGenre.name,
                _id: movieGenre._id,
              },
              imageURL: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
              isTopRated: true,
              description: movie.overview,
              budget: movie.budget,
              popularity: movie.popularity,
              releaseDate: movie.release_date,
              runtime: movie.runtime,
              language: movie.language,
              posterPath: movie.poster_path,
            });

            await topRatedMovie.save();
          } else {
            console.log(`Genre not found for ID: ${movieGenreId}`);
          }
        }
      }
    }

    res.send("Top-rated movies fetched and saved successfully!");
  } catch (error) {
    console.error("Error fetching or saving top-rated movies:", error);
    res.status(500).send("Error fetching or saving top-rated movies.");
  }
});

module.exports = router;
