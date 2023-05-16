const logger = require("./logger");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "ValidationError") {
    return response.status(400).json({
      error: error.message
    });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(400).json({
      error: error.message
    })
  }

  next(error);
};

const getTokenFrom = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  }

  next();
};

const userExtractor = async (request, response, next) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken) {
    return response.status(401).json({
      error: "token invalid"
    });
  }

  request.user = await User.findById(decodedToken.id);

  next();
};

module.exports = {
  errorHandler, getTokenFrom, userExtractor
};