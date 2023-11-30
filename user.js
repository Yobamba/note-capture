const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const findOrCreate = require("mongoose-findorcreate");

mongoose.connect(process.env.MONGODB_URI);
// mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema({
  googleId: String,
  username: String,
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model("users", userSchema);

module.exports = User;
