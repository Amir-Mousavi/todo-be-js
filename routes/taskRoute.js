const express = require("express");

const {
  findAll,
  findById,
  deleteById,
  updateById,
  createTask,
} = require("../controller/taskController");

const taskRoute = express();

taskRoute.post("", createTask);

taskRoute.get("", findAll);

taskRoute.get("/:id", findById);

taskRoute.delete("/:id", deleteById);

taskRoute.put("/:id", updateById);

module.exports = taskRoute;
