const express = require("express");
const app = express();

app.use(express.json());

const projects = [];
let requests = 0;

// funcao para Middleware Local
function checkIdProjectExist(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.json({ message: "This project id not exists" });
  }

  next();
}

// funcao para Middleware Global
function requestGlobalCount(req, res, next) {
  requests++;
  console.log(`Requests: ${requests}`);
  next();
}

app.use(requestGlobalCount);

//Create Project
app.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id: id,
    title: title,
    tasks: []
  };
  projects.push(project);
  return res.json({ message: "Project created!" });
});

//List all projects
app.get("/projects", (req, res) => {
  return res.json(projects);
});

//Update project
app.put("/projects/:id", checkIdProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.title = title;
  return res.json(project);
});

//Delete project
app.delete("/projects/:id", checkIdProjectExist, (req, res) => {
  const { id } = req.params;
  const project = projects.findIndex(p => p.id == id);
  projects.splice(project, 1);

  return res.json({ message: "project deleted" });
});

//Insert content in task projects
app.post("/projects/:id/tasks", checkIdProjectExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.tasks.push(title);
  return res.json({ message: "task created" });
});

app.listen(3333);
