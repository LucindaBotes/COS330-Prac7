const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const realApp = express();
const honeypotApp = express();

const realData = { "data": "This is real data" };
const fakeData = { "data": "This is fake data for honeypot" };

const realProducts = [
    {
        id: 1,
        name: "Real Product 1",
        image: "real_product1.jpg",
        description: "Description for real product 1.",
        price: "$199.99"
    },
    // ... (add more real products as needed)
];

const fakeProducts = [
    {
        id: 1,
        name: "Fake Product 1",
        image: "fake_product1.jpg",
        description: "Description for fake product 1.",
        price: "$999.99"
    },
    // ... (add more fake products as needed)
];


realApp.use(bodyParser.urlencoded({ extended: true }));
realApp.use(bodyParser.json());

honeypotApp.use(bodyParser.urlencoded({ extended: true }));
honeypotApp.use(bodyParser.json());

const publicPath = path.join(__dirname, 'public');
realApp.use(express.static(publicPath));
honeypotApp.use(express.static(publicPath));

// Real server data endpoint
realApp.get('/data', (req, res) => {
    return res.json(realProducts);
});

// Honeypot data endpoint
honeypotApp.get('/data', (req, res) => {
    return res.json(fakeProducts);
});

// An array to store potential hackers' data
const potentialHackers = [];

realApp.post('/submit_feedback', (req, res) => {
    if (req.body.honeypot) {
        // This is likely a bot! Do not process the form but store their information.
        const hackerData = {
            ip: req.ip,
            userAgent: req.headers['user-agent'],
            time: new Date().toISOString()
        };
        potentialHackers.push(hackerData);
        console.log('Potential hacker detected:', hackerData);

        return res.send('Thanks for the feedback!');
    }
    // Process the genuine feedback here.
    console.log('Genuine Feedback:', req.body);
    return res.send('Thanks for the genuine feedback!');
});

realApp.get('/hackers', (req, res) => {
    return res.json(potentialHackers);
});

const realServer = realApp.listen(443, () => {
    console.log('Server running on port 443');
});

const honeypotServer = honeypotApp.listen(80, () => {
    console.log('Honeypot running on port 80');
});
