const express = require("express");
require("dotenv").config();
const app = express();
const parser = require("body-parser");
const cors = require("cors");

// Load environment variables from .env file in the root directory
const path = require('path');
// const dotenv = require('dotenv');
// dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Import Middlewares
const {
  errorHandle,
  logger,
  verifyToken,
  validateToken,
  limiter,
} = require("./middlewares/index.js");

// Import Passport JWT
const passport = require("passport");
const jwtStrategy = require("./common/strategies/jwt-strategy.js");
passport.use(jwtStrategy);

// Import routes
const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/user.js");
const userDetailRoute = require("./routes/user_detail.js");

// DB Connect
const dbConnect = require("./db/db.js");
const { createBookShema } = require("./common/validation/index.js");
dbConnect().catch((err) => {
  console.log(err);
});

// Allow requests from specific origin (your frontend's URL)
app.use(cors());

app.use(parser.json());
app.use("/api/auth", authRoute);
// app.use("/users", passport.authenticate("jwt", { session: false }), userRoute);
app.use("/api/users", userRoute);
app.use("/api/userDetail", userDetailRoute);
// app.use("/books", createBookShema, bookRoute);
app.use(errorHandle);

// Use For Http
app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
