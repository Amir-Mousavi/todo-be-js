const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/User");

const projectRoute = express();

// signup an user
projectRoute.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).send("username or password is null");
  }

  try {
    const savedUser = await User.create({
      username: username,
      password: await bcrypt.hash(password, 10),
    });

    res.status(201).send(savedUser);
  } catch (e) {
    console.log(e);
    res.status(500).send("Something went wrong");
  }
});

projectRoute.post("/login", (req, res) => {
  // login
});

module.exports = projectRoute;
