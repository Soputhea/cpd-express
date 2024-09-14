const mongoose = require("mongoose");

// Define a schema
const userSchema = new mongoose.Schema({
  firstname: { require: true, type: String },
  lastname: { require: true, type: String },
  gender: {
    type: String,
    require: true,
    enum: ["male", "female"],
    default: "male",
  },
  email: { type: String, require: true, unique: true },
  password: { type: String },
  userType: {
    type: String,
    enum: ["sso", "normal"],
    default: "normal",
  },
  role: {
    type: String,
    require: true,
    enum: ["user", "editor", "admin"],
    default: "user",
  },
  createdDate: { type: Date, default: Date.now() },
  // user_detail_id: [{type: mongoose.Types.ObjectId, ref: "UserDetail"}],
});
// Create a model
const User = mongoose.model("User", userSchema);

module.exports = User;
