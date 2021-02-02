const User = require("../models/User");
const Project = require("../models/Project");

exports.createProject = async function (req, res) {
  const user = req.user;

  if (!user) {
    return res.status(400).send("There is no user!");
  }

  const project = await user.createProject({
    title: req.body.title,
  });

  res.status(201).send(project);
};

exports.findAll = async function (req, res) {
  const user = req.user;
  const projects = await Project.findAll({
    where: {
      userId: user.id,
    },
  });

  res.send(projects);
};

exports.findById = async function (req, res) {
  const user = req.user;

  const project = await Project.findOne({
    id: req.params.id,
    userId: user.id,
  });

  res.send(project);
};

exports.deleteById = async function (req, res) {
  const user = req.user;

  try {
    const numberOfDeletedItems = await Project.destroy({
      where: {
        id: req.params.id,
        userId: user.id,
      },
    });

    if (numberOfDeletedItems) {
      res.send(`Deleted ${req.params.id}`);
    } else {
      res.status(400).send(`There is no project with id -> ${req.params.id}`);
    }
  } catch {
    res.status(500).send("Something went wrong");
  }
};

exports.updateById = async function (req, res) {
  const user = req.user;
  const project = await Project.findOne({
    where: {
      id: req.params.id,
      userId: user.id,
    },
  });

  if (!project) {
    res.status(400).send("No project");
  } else {
    project.title = req.body.title;
  }

  try {
    project.save();
    res.send("updated");
  } catch {
    res.status(500).send("Something went wrong");
  }
};
