const express = require('express');

const planetsRouter = express.Router();

planetsRouter.get('/', getAllPlanets);


module.exports = planetsRouter;