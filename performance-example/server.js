const express = require('express');

const app = express();

function delay(duration) {
    const startTime = Date.now();
    while (Date.now() - startTime < duration) {
        // do nothing
    }
}

app.get('/', (req, res) => {
    res.send(`Performance Example ${process.pid}`);
});

app.get('/timer', (req, res) => {
    delay(4000);
    // setTimeout(() => {
    //     res.send('Ding ding ding!');
    // }, 1000);
    res.send(`Beep beep beep! ${process.pid}`);
});

console.log('Starting server...');
console.log('Worker process started');
app.listen(3000);