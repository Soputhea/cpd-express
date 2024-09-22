const UserDetail = require("../models/user_detail");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

const createUserDetail = asyncHandler(async (req, res) => {
  try {
    const { user_id, ...userDetailData } = req.body; // Destructure user_id and other fields from the request body

    // Check if the user_id exists in the User model
    const userExists = await User.findById(user_id);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new UserDetail instance with the provided data and user_id
    const userDetail = new UserDetail({ user_id, ...userDetailData });

    // Save the new UserDetail to the database
    const savedUserDetail = await userDetail.save();

    res.status(201).json(savedUserDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get All UserDetails
const getAllUserDetails = asyncHandler(async (req, res) => {
  // const results = await UserDetail.find().populate("user_id")
  const results = await UserDetail.find();
  return res.json(results);
});

// Get UserDetail by ID
const getUserDetailByID = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userDetail = await UserDetail.findById(id).populate("user_id");

  if (!userDetail) {
    return res.status(404).json({ message: "User Detail not found" });
  }
  res.status(200).json(userDetail);
});

// Get UserDetail by UserID
const getUserDetailsByUserId = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  try {
    const userDetail = await UserDetail.findOne({ user_id: userId }).exec();
    if (!userDetail) {
      return res
        .status(404)
        .json({ message: "No user detail found for the given user_id" });
    }
    res.json(userDetail);
  } catch (err) {
    console.error("Error retrieving user detail:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Update a user detail by ID
const updateUserDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, ...updateData } = req.body;

    // If a new user_id is provided, verify it exists in the User collection
    if (user_id) {
      const userExists = await User.findById(user_id);
      if (!userExists) {
        return res.status(404).json({ message: 'User not found' });
      }
      updateData.user_id = user_id; // Include the valid user_id in the update data
    }

    // Update the UserDetail with the provided data
    const updatedUserDetail = await UserDetail.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Validate the data before updating
    });

    
    if (!updatedUserDetail) {
      return res.status(404).json({ message: 'User Detail not found' });
    }

    res.status(200).json(updatedUserDetail);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete UserDetail by ID
const deleteUserDetailById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the UserDetail by ID
    const deletedUserDetail = await UserDetail.findByIdAndDelete(id);

    if (!deletedUserDetail) {
      return res.status(404).json({ message: "User Detail not found" });
    }

    res.status(200).json({ message: "User Detail deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = {
  createUserDetail,
  getAllUserDetails,
  updateUserDetail,
  getUserDetailByID,
  getUserDetailsByUserId,
  deleteUserDetailById,
};
