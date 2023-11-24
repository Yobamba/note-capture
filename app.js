const dotenv = require("dotenv");
dotenv.config();
const bodyParser = require("body-parser");
const mongodb = require("./db/connect");
const express = require("express");
const cors = require("cors");
const port = process.env.PORT || 8080;
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");
const findOrCreate = require("mongoose-findorcreate");
const User = require("./user.js");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const app = express();
const app2 = require("./test.js"); // using this to find a way to ommit the sign-in from swagger ui
const path = require("path");

app.use(
  session({
    secret: "Little secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Serialize the user to store in the session
passport.serializeUser((User, done) => {
  console.log("Serialize user: ", User);
  done(null, User.id); // Assuming you have an "id" field in your User model
});

// Deserialize the user from the session
passport.deserializeUser((id, done) => {
  console.log("Deserialize user: ", id);
  User.findById(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err, null);
    });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "https://note-capture.onrender.com/auth/google/note-capture",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        { googleId: profile.id, username: profile.displayName },
        function (err, user) {
          console.log("profile: ", profile);
          return cb(err, user);
        }
      );
    }
  )
);

app.get("/auth/google", (req, res) => {
  console.log("in the auth code");
  passport.authenticate("google", { scope: ["profile"] })(req, res);
});

app.get(
  "/auth/google/note-capture",
  passport.authenticate("google", {
    failureRedirect: "https://note-capture.onrender.com/start_page/sign-in",
  }),
  function (req, res) {
    res.redirect("https://note-capture.onrender.com/api-docs");
    console.log("in the auth doc");
  }
);

// Adding a route for "sign-in" that is not included in Swagger documentation
app.get("/sign-in", (req, res) => {
  // Handle sign-in logic here
  res.sendFile("sign-in.html", { root: path.join(__dirname, "./public") });
});

app
  .use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    //hide the internal api endpoints
    // customCss: 'div[id^="operations-hidden"]{display:none} #operations-tag-hidden{display:none}'
    })).use(bodyParser.json())
  .use(cors({ origin: "*" }))
  .use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
  })
  .use("/", require("./routes"));

mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});

app.listen(3000, () => {
  console.log("listening on port 3000 for api documentation");
});
