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
