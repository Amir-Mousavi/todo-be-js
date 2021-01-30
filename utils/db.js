const Sequelize = require("sequelize");

const sequelize = new Sequelize("todo", "root", "testtest", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
