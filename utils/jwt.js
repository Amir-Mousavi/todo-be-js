const secretKey = require("../constants/jwtSecret");
const jwt = require("jsonwebtoken");

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
