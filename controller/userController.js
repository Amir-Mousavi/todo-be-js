const bcrypt = require("bcrypt");
var validator = require("validator");

const jwt = require("../utils/jwt");

const { sendConfirmationEmail } = require("./mailController");

const User = require("../models/User");

exports.signUp = async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).send("username or password is null");
  }

  if (!validator.isEmail(username)) {
    return res.status(400).send("Username must be an email address");
  }

  try {
    const savedUser = await User.create({
      username: username,
      password: await bcrypt.hash(password, 10),
    });

    sendConfirmationEmail({ email: username, userId: savedUser.id });
    res.status(201).send(savedUser);
  } catch (e) {
    res.status(500).send(e.message);
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

exports.confirmEmailAddress = function (req, res) {
  const {
    params: { confirmToken },
  } = req;

  jwt.verifyConfirmToken(confirmToken, async (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      const { userId } = result;

      const user = await User.findByPk(userId);

      if (user) {
        user.isConfirmed = true;
        user.save();

        res.status(200).send("Confirmed");
      } else {
        res.status(500).send("Something went wrong");
      }
    }
  });
};

exports.refreshToken = jwt.refreshToken;
