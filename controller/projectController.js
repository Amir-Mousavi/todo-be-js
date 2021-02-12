const Project = require("../models/Project");
const { DEFAULT_PAGINATION } = require("../constants/pagination");
const { paginationObject } = require("../utils/pagination");

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
  const page = parseInt(req.query.page || DEFAULT_PAGINATION.page);
  const size = parseInt(req.query.size || DEFAULT_PAGINATION.size);

  const { rows, count } = await Project.findAndCountAll({
    where: {
      userId: user.id,
    },
    offset: page * size,
    limit: size,
  });

  res.send({
    data: rows,
    meta: {
      ...paginationObject({ page, size, count }),
    },
  });
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
