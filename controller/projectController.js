const User = require("../models/User");
const Project = require("../models/Project");

exports.createProject = async function (req, res) {
  const userId = req.body.userId;

  const user = await User.findByPk(userId);

  if (!user) {
    return res.status(400).send("There is no user!");
  }

  const project = await user.createProject({
    title: req.body.title,
  });

  res.status(201).send(project);
};

exports.findAll = async function (req, res) {
  const projects = await Project.findAll();

  res.send(projects);
};

exports.findById = async function (req, res) {
  const project = await Project.findByPk(req.params.id);

  res.send(project);
};

exports.deleteById = async function (req, res) {
  try {
    const numberOfDeletedItems = await Project.destroy({
      where: {
        id: req.params.id,
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
  const project = await Project.findByPk(req.params.id);

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
