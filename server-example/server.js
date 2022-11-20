const https = require('https');
const path = require('path');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const passport = require('passport');
const { Strategy } = require('passport-google-oauth20');

require('dotenv').config();

const PORT = 3000;

const config = {
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
}

const AUTH_OPTIONS = {
    callbackURL: '/auth/google/callback',
    clientId: config.CLIENT_ID,
    clientSecret: config.CLIENT_SECRET
}

function verifyCallback(accessToken, refreshToken, profile, done) {
    console.log(`Google Profile: ${profile}`);
    done(null, profile);
}

passport.use(new Strategy(AUTH_OPTIONS, verifyCallback));

const app = express();

app.use(helmet());
app.use(passport.initialize());

function checkLoggedIn(req, res, next) {
    const isLoggedIn = true;
    if (!isLoggedIn) {
        return res.status(401).json({
            error: 'You must be logged in!'
        })
    }
    next();
}

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/auth/google', (req, res) => {

});

app.get('/auth/google/callback', (req, res) => {

})

app.get('/auth/logout', (req, res) => {

})

app.get('/secret', checkLoggedIn, (req, res) => {
    res.send('Your personal secret value is 34!');
});

https.createServer({
    cert: fs.readFileSync('cert.pem'),
    key: fs.readFileSync('key.pem')
}, app).listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})