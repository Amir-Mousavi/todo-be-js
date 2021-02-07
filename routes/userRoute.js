const express = require("express");

const { signUp, login, refreshToken } = require("../controller/userController");

const projectRoute = express();

projectRoute.post("/signup", signUp);

projectRoute.post("/login", login);

projectRoute.post("/refreshToken", refreshToken);

module.exports = projectRoute;
