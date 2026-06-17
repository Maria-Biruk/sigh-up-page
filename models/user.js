const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: false, // optional for OAuth users
  },
  googleId: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("User", UserSchema);
