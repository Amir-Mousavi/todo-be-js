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

const refreshToken = function (req, res, next) {
  const { refreshToken } = req.body;
  console.log(refreshToken);

  if (!refreshToken) {
    return res.status(400).send("Refresh token is empty");
  }
  jwt.verify(refreshToken, secretKey, async (err, result) => {
    if (err) {
      return res.status(500).send();
    }
    const { id } = result;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).send("This user does not exist");
    }

    req.body.username = user.username;
    generateToken(req, res, next);
  });
};

const createConfirmToken = function ({ email, userId }, cb) {
  jwt.sign(
    { userId, email },
    process.env.EMAIL_CONFIRMATION_SECRET,
    {
      expiresIn: "10h",
    },
    (err, token) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, token);
      }
    }
  );
};

const verifyConfirmToken = function (token, cb) {
  jwt.verify(token, process.env.EMAIL_CONFIRMATION_SECRET, (err, result) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, result);
    }
  });
};

module.exports = {
  generateToken,
  verifyToken,
  refreshToken,
  verifyConfirmToken,
  createConfirmToken,
};
