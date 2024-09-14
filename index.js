const express = require("express");
require("dotenv").config();
const app = express();
const parser = require("body-parser");



// Import Middlewares
const { errorHandle, logger, verifyToken, validateToken, limiter } = require("./middlewares/index.js");

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
dbConnect().catch((err) => { console.log(err) })


app.use(parser.json());
app.use("/auth", authRoute);
// app.use("/users", passport.authenticate("jwt", { session: false }), userRoute);
app.use("/users", userRoute);
app.use("/userDetail", userDetailRoute);
// app.use("/books", createBookShema, bookRoute);
app.use(errorHandle);


// Use For Http
app.listen(4000, () => {
    console.log('Listening on port 4000!')
})