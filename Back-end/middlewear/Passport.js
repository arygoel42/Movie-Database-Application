const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { user } = require("../models/user");
require("dotenv").config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3009/api/user/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      //   console.log("Google Profile:", profile);
      let checkUser = await user.findOne({ email: profile.emails[0].value });
      if (checkUser) {
        done(null, checkUser);
      } else {
        let newUser = new user({
          name: profile.displayName,
          email: profile.emails[0].value,
          GoogleID: profile.id,
        });
        await newUser.save();
        done(null, newUser);
      }
    }
  )
);

// Serialize the user into the session
passport.serializeUser((user, done) => {
  //   console.log("Serializing User: ", user); // For debugging purposes
  done(null, user.GoogleID); // Make sure the field name matches the user schema
});

// Deserialize the user from the session
passport.deserializeUser(async (GoogleID, done) => {
  try {
    console.log("Deserializing User with GoogleID: ", GoogleID); // Debugging
    const checkUser = await user.findOne({ GoogleID: GoogleID });
    if (checkUser) {
      console.log("User found:", checkUser); // Ensure user is found
      done(null, checkUser);
    } else {
      console.log("User not found");
      done(new Error("User not found"));
    }
  } catch (error) {
    console.error("Error during deserialization:", error); // Log the error
    done(error);
  }
});
