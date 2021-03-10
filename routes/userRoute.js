const express = require("express");

const {
  signUp,
  login,
  refreshToken,
  confirmEmailAddress,
} = require("../controller/userController");

const userRoute = express();

userRoute.post("/signup", signUp);

userRoute.post("/login", login);

userRoute.post("/refreshToken", refreshToken);

userRoute.get("/confirm/:confirmToken", confirmEmailAddress);

module.exports = userRoute;
