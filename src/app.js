const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());
app.use('/repositories/:id', validateIdUUID, validateIdExist);

//functions midlewares
function validateIdUUID(request, response, next) {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid ID '});
  };

  next();
};

function validateIdExist(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(r => r.id === id);

  if (repositoryIndex<0) {
    return response.status(400).json({ error: 'Repository not found. '});
  };

  return next();
};

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);  
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositorieIndex].likes,
  };

  repositories[repositorieIndex] = repository;

  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(r => r.id === id);

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repositorieIndex = repositories.findIndex(repositorie => repositorie.id === id);

  repositories[repositorieIndex].likes += 1;

  return response.status(200).json(repositories[repositorieIndex]);
});

module.exports = app;
