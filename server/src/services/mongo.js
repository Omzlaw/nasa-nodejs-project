const mongoose = require('mongoose');

const MONGO_URL = 'mongodb+srv://nasa-api:XpmIV8guVFUw4ZSu@nasa-api-cluster.rg7z9.mongodb.net/?retryWrites=true&w=majority';

mongoose.connection.once('open', () => {
    console.log('MongoDB connection ready!');
});

mongoose.connection.on('error', (err) => {
    console.error(err)
});

async function mongoConnect() {
    mongoose.connect(MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}

async function mongoDisconnect() {
    await mongoose.disconnect();
}

module.exports = {
    mongoConnect,
    mongoDisconnect
}