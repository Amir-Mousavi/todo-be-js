const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt");

const User = require("../models/User");

exports.signUp = async function (req, res) {
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
};

exports.login = async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  const user = await User.findOne({
    where: {
      username: username,
    },
  });

  if (!user) {
    res.status(400).send("There is no user");
  } else {
    if (await bcrypt.compare(password, user.password)) {
      jwt.generateToken(req, res);
    } else {
      res.status(403).send("Password is wrong");
    }
  }
};
