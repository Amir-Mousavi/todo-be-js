const Sequelize = require("sequelize");

require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });

const userName = process.env.USER_NAME;
const password = process.env.PASSWORD;
const host = process.env.HOST;
const dbName = process.env.DB_NAME;
const dialect = process.env.DIALECT;

const sequelize = new Sequelize(dbName, userName, password, {
  host,
  dialect,
});

module.exports = sequelize;
