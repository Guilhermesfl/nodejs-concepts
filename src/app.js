const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateUuid(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) return response.status(400).json({ error: "Invalid id"});

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validateUuid, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIdx = repositories.findIndex(repository => repository.id === id);

  if (repoIdx < 0 ) return response.status(400).send();

  repositories[repoIdx] = {
    id,
    title,
    url,
    techs, likes: repositories[repoIdx].likes
  };

  return response.json(repositories[repoIdx]);
});

app.delete("/repositories/:id", validateUuid, (request, response) => {
  const { id } = request.params;
  const repoIdx = repositories.findIndex(repository => repository.id === id);

  if (repoIdx < 0 ) return response.status(400).send();

  repositories.splice(repoIdx, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", validateUuid, (request, response) => {
  const { id } = request.params;

  const repoIdx = repositories.findIndex(repository => repository.id === id);

  if (repoIdx < 0 ) return response.status(400).send();

  repositories[repoIdx].likes++;

  return response.json(repositories[repoIdx]);
});

module.exports = app;
