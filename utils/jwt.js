const jwt = require("jsonwebtoken");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const secretKey = process.env.SC_CODE;

const generateToken = function (req, res, next) {
  const username = req.body.username;

  jwt.sign({ username }, secretKey, (err, token) => {
    if (err) {
      res.status(500).send();
    } else {
      res.send(token);
    }
  });
};

const verifyToken = function (req, res, next) {
  const token = req.headers.authorization;
  console.log(req.headers);

  if (!token) {
    res.status(403).send();
  } else {
    jwt.verify(token, secretKey, (err, result) => {
      if (err) {
        res.status(403).send();
      } else {
        next();
      }
    });
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
