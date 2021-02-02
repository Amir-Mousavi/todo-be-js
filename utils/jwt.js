const jwt = require("jsonwebtoken");
const User = require("../models/User");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const secretKey = process.env.SC_CODE;

const generateToken = async function (req, res, next) {
  const username = req.body.username;

  const user = await User.findOne({ where: { username: username } });

  jwt.sign({ username }, secretKey, { expiresIn: "3h" }, (err, token) => {
    if (err) {
      res.status(500).send();
    } else {
      // generate refresh token
      jwt.sign({ id: user.id }, secretKey, (err, refreshToken) => {
        if (err) {
          res.status(500).send();
        } else {
          res.send({
            token,
            refreshToken,
          });
        }
      });
    }
  });
};

const verifyToken = function (req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    res.status(403).send();
  } else {
    jwt.verify(token, secretKey, async (err, result) => {
      if (err) {
        res.status(403).send();
      } else {
        const username = result.username;
        const user = await User.findOne({ where: { username } });
        req.user = user;
        next();
      }
    });
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
