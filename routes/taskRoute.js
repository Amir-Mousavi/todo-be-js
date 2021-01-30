const express = require("express");
const User = require("../models/User");
const Task = require("../models/Task");
const taskRoute = express();

// Create a task
taskRoute.post("", async (req, res) => {
  const userId = req.body.userId;

  const user = await User.findByPk(userId);

  if (!user) {
    return res.status(400).send("There is no user!");
  }

  const task = await user.createTask({
    title: req.body.title,
    completed: false,
  });

  res.status(201).send(task);
});

// get all
taskRoute.get("", async (req, res) => {
  const tasks = await Task.findAll();

  res.send(tasks);
});

// find by id
taskRoute.get("/:id", async (req, res) => {
  const task = await Task.findByPk(req.params.id);

  res.send(task);
});

// delete by id

taskRoute.delete("/:id", async (req, res) => {
  try {
    const numberOfDeletedItems = await Task.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (numberOfDeletedItems) {
      res.send(`Deleted ${req.params.id}`);
    } else {
      res.status(400).send(`There is no task with id -> ${req.params.id}`);
    }
  } catch {
    res.status(500).send("Something went wrong");
  }
});

// Update a task
taskRoute.put("/:id", async (req, res) => {
  const task = await Task.findByPk(req.params.id);

  if (!task) {
    res.status(400).send("No Task");
  } else {
    task.title = req.body.title || task.title;
    task.completed = req.body.completed || task.completed;
  }

  try {
    task.save();
    res.send("updated");
  } catch {
    res.status(500).send("Something went wrong");
  }
});

module.exports = taskRoute;
