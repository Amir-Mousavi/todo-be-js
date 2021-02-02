const User = require("../models/User");
const Task = require("../models/Task");

exports.createTask = async function (req, res) {
  const user = req.user;

  if (!user) {
    return res.status(400).send("There is no user!");
  }

  const task = await user.createTask({
    title: req.body.title,
    completed: false,
  });

  res.status(201).send(task);
};

exports.findAll = async function (req, res) {
  const user = req.user;
  const tasks = await Task.findAll({
    where: { userId: user.id },
  });

  res.send(tasks);
};

exports.findById = async function (req, res) {
  const user = req.user;
  const task = await Task.findOne({
    id: req.params.id,
    userId: user.id,
  });

  res.send(task);
};

exports.deleteById = async function (req, res) {
  const user = req.user;
  try {
    const numberOfDeletedItems = await Task.destroy({
      where: {
        id: req.params.id,
        userId: user.id,
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
};

exports.updateById = async function (req, res) {
  const user = req.user;
  const task = await Task.findOne({
    where: {
      id: req.params.id,
      userId: user.id,
    },
  });

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
};
