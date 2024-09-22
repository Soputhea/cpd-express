const express = require("express");
const passport = require("passport");
const {
  createUserDetail,
  getAllUserDetails,
  getUserDetailByID,
  deleteUserDetailById,
  getUserDetailsByUserId,
  updateUserDetail
} = require("../controllers/user_detail");
const { authorize, resourceControl } = require("../middlewares");
const UserDetailRoute = express.Router();

UserDetailRoute.get("/", getAllUserDetails);
UserDetailRoute.post("/", createUserDetail);
UserDetailRoute.put("/:id", updateUserDetail);
UserDetailRoute.get("/:id", getUserDetailByID);
UserDetailRoute.get("/userId/:userId", getUserDetailsByUserId);
UserDetailRoute.delete("/:id",
  // authorize("delete_own_record"),
  // resourceControl("user"),
  deleteUserDetailById
);

module.exports = UserDetailRoute;
