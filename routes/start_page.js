const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const path = require("path");
const validation = require("../validation");
// const playersController = require("../controllers/nba_players.js");
const notesController = require("../controllers/notes.js");
const passportLocalMongoose = require("passport-local-mongoose");
const passport = require("../app.js");
const findOrCreate = require("mongoose-findorcreate");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

// router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.get("/sign-in", (req, res) => {
  console.log("in the get sign in code");
  res.sendFile("sign-in.html", { root: path.join(__dirname, "../public") });
});

router.post(
  "/register",
  validation.saveCreatedUser,
  notesController.createUser,
  (req, res) => {
    // res.sendFile("login.html", { root: path.join(__dirname, "../public") });
    res.sendFile("login", { root: path.join(__dirname, "../start_page") });
  }
);

// router.use(passport.initialize());
// router.use(passport.session());

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.CLIENT_ID,
//       clientSecret: process.env.CLIENT_SECRET,
//       callbackURL: "http://localhost:3000/auth/google/nba",
//       userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
//     },
//     function (accessToken, refreshToken, profile, cb) {
//       User.findOrCreate({ googleId: profile.id }, function (err, user) {
//         return cb(err, user);
//       });
//     }
//   )
// );
// router.get("/auth/google", (req, res) => {
//   console.log("in the auth code");
//   passport.authenticate("google", { scope: ["profile"] });
// });

// router.get("/login", (req, res) => {
//   res.sendFile("login.html", { root: path.join(__dirname, "../public") });
//   // res.redirect("login.html", { root: path.join(__dirname, "../public") });
// });

// router.post("/login", playersController.getUser, (req, res) => {});

module.exports = router;
