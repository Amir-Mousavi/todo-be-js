const express = require("express");

const {
  findAll,
  findById,
  updateById,
  deleteById,
  createProject,
} = require("../controller/projectController");

const projectRoute = express();

projectRoute.post("", createProject);

projectRoute.get("", findAll);

projectRoute.get("/:id", findById);

projectRoute.delete("/:id", deleteById);

projectRoute.put("/:id", updateById);

module.exports = projectRoute;
