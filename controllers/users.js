const User = require("../models/user");
const asyncHandler = require("express-async-handler");

// Create user
const createUser = asyncHandler(async (req, res) => {
  try {
    const { firstname, lastname, email } = req.body;
    const user = new User({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password,
    });
    const result = await user.save();
    return res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get User By Id
const getUser = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  return res.json(user);
});

// Get All Users
const getUsers = asyncHandler(async (req, res) => {
  // const users = await User.find().populate("tweets")
  const users = await User.find().sort({ createdDate: "desc" });
  return res.json(users);
});
// Update User
const updateUserById = asyncHandler(async (req, res, next) => {
  const id = req.params.id;
  const { password, confirmedPassword, ...self } = req.body;
  const result = await User.updateOne({ ...self, id });
  const user = await User.findById(id);
  return res.json({ result, user });
});

// Delete User By Id
const deleteUserById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const result = await User.deleteOne({ _id: id });
  return res.json(result);
});

// Get Tweets by User ID
const getTweetByUserId = asyncHandler(async (req, res) => {
  const id = req.params.id;
  // 1st Way
  const tweets = await Tweet.find({
    byUser: id,
  });
  return res.json({ tweets });

  // 2st Way
  // const tweets = await User.findById(id).select('tweets').populate('tweets')
  // return res.json({ tweets})
});

module.exports = {
  getUser,
  getUsers,
  deleteUserById,
  createUser,
  getTweetByUserId,
  updateUserById,
};
