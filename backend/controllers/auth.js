const User = require("../models/user.js");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const { header } = require("express-validator");
const { authorize } = require("passport");
const { signJWT } = require("../utils/index.js");

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.json({ message: "User not found!" });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.json({ message: "User and Password is incorrect!" });
  }

  // Sign JWT
  const token = signJWT(user._id, user.email);
  return res.status(200).json({ user, token });
});

const signupUser = asyncHandler(async (req, res) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const user = new User({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role,
    });
    const result = await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const showGoogleOAuthScreen = asyncHandler(async (req, res) => {
  const uri = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK}&response_type=code&scope=profile email openid`;
  return res.redirect(uri);
});

const handleGoogleLogin = asyncHandler(async (req, res) => {
  const code = req.query.code;
  // 1 - Exchange one-time code for access_token(JWT) from Google API
  // npm install axios
  const url = "https://oauth2.googleapis.com/token";
  const { data } = await axios.post(url, {
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    code: code,
    redirect_uri: process.env.GOOGLE_CALLBACK,
    grant_type: "authorization_code",
  });

  // 2 - Use access_token to get userinfo from Google API
  const access_token = data.access_token;
  const get_user_url = "https://www.googleapis.com/oauth2/v2/userinfo";
  const response = await axios.get(get_user_url, {
    headers: { Authorization: `Bearer ${access_token}` },
  });
  const userprofile = response.data;

  // 3 - Register user in our database
  const user = await User.findOne({
    email: userprofile.email,
  });

  if (!user) {
    // Register new user
    const newUser = new User({
      firstname: userprofile.name,
      lastname: userprofile.given_name,
      email: userprofile.email,
      userType: "sso",
    });
    const result = await newUser.save();
    const token = signJWT(result._id, user.email);
    return res.json(token);
  }
  // 4 - Sign user with our own JWT
  const token = signJWT(user._id, user.email);
  return res.json({
    token,
  });
});

module.exports = {
  loginUser,
  signupUser,
  handleGoogleLogin,
  showGoogleOAuthScreen,
};
