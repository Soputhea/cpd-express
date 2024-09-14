const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { getPermissionsByRoleName } = require("./../roles/role");
const UserDetail = require("../models/user_detail");



const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

const errorHandle = (err, req, res, next) => {
  return res.status(500).send(`messages: ${err.message}`);
};

const idValidator = (req, res, next) => {
  const id = req.params.id;
  if (!isNaN(id)) {
    next();
  }
  throw Error(`Id: ${id} contains string`);
};

const handleValidation = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) {
    next();
  } else {
    return res.status(401).json({ error: result.array() });
  }
};

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "Authentication failed" });
  }
  token = token.replace("Bearer ", "");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
};

const validateToken = (req,) => {
  // Extract toke from request header from client
  let token = req.header("Authorization");
  if (!token) {
    return false
  }
  token = token.replace("Bearer ", "");
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (decoded) {
    return true;
  } else {
    return false;
  }
};

const authorize = (permission) => {
  return (req, res, next) => {
    const user = req.user;
    console.log(user);
    if (!req.user) {
      return res.sendStatus(401).json({ error: "Access denied!" }); // Unauthorized
    }
    const permissions = getPermissionsByRoleName(user.role);
    if (permissions.includes(permission)) {
      return next();
    } else {
      return res.status(403).json({ error: "Forbidden" });
    }
  };
};

const resourceControl = (resource) => {
  return async (req, res, next) => {
    const deletedId = req.params.id;
    const userId = req.user.id;
    // const permission = req.locals.permission
    if (req.user.role == "admin") {
      return next();
    }
    if (req.permission == "delete_own_record") {
      if (resource == "userDetail") {
        const userDetail = await UserDetail.findOne({ _id: deletedId, byUser: userId });
        if (userDetail) {
          return next();
        } else {
          return res.status(403).json({ error: "Forbidden" });
        }
      }
    }
  };
};

module.exports = {
  logger,
  idValidator,
  errorHandle,
  verifyToken,
  validateToken,
  authorize,
  handleValidation,
  resourceControl,
};
