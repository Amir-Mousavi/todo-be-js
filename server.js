const express = require("express");

const taskRoute = require("./routes/taskRoute");
const projectRoute = require("./routes/projectRoute");
const userRoute = require("./routes/userRoute");

const jwt = require("./utils/jwt");
const db = require("./utils/db");

const Task = require("./models/Task");
const Project = require("./models/Project");
const User = require("./models/User");

const app = express();

app.use(express.json());

app.use("/tasks", jwt.verifyToken, taskRoute);
app.use("/projects", jwt.verifyToken, projectRoute);
app.use("/users", userRoute);

app.get("/", (req, res) => {
  res.send("Hello world");
});

Project.hasMany(Task);
User.hasMany(Task);
User.hasMany(Project);

db.sync()
  .then(() => {
    app.listen(3000);
  })
  .catch((e) => {
    console.log(e);
  });
