const http = require('http');
const mongoose = require('mongoose');

const app = require('./app');
const server = http.createServer(app);

const {
    loadPlanetsData
} = require('./models/planets.model');
const PORT = process.env.PORT || 8000;

const MONGO_URL = 'mongodb+srv://nasa-api:XpmIV8guVFUw4ZSu@nasa-api-cluster.rg7z9.mongodb.net/?retryWrites=true&w=majority';

async function loadInitialData() {
    await loadPlanetsData();
}

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
    console.error(err)
})

async function startServer() {
    await mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    await loadInitialData();

    server.listen(PORT, () => {
        console.log('Server is listening on port: ' + PORT);
    });
}

startServer();