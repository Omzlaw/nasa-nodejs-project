const http = require('http');

require('dotenv').config();

const app = require('./app');

const { mongoConnect } = require('./services/mongo');

const server = http.createServer(app);

const {
    loadPlanetsData
} = require('./models/planets.model');
const { loadLaunchesData } = require('./models/launches.model');
const PORT = process.env.PORT || 8000;



async function loadInitialData() {
    await loadPlanetsData();
    await loadLaunchesData();
}


async function startServer() {
    await mongoConnect();
    await loadInitialData();

    server.listen(PORT, () => {
        console.log('Server is listening on port: ' + PORT);
    });
}

startServer();