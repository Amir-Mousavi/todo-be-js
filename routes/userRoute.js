const express = require("express");

const { signUp, login } = require("../controller/userController");

const projectRoute = express();

projectRoute.post("/signup", signUp);

projectRoute.post("/login", login);

module.exports = projectRoute;
