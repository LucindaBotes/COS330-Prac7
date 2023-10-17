const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
require('dotenv');

const realApp = express();
const honeypotApp = express();
const IP_API_KEY = process.env.IP_API_KEY;

const realData = { "data": "This is real data" };
const fakeData = { "data": "This is fake data for honeypot" };

const realProducts = require('./RealData.json');

const fakeProducts = require('./FakeData.json');


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

realApp.post('/submit_feedback', async (req, res) => {
    if (req.body.honeypot) {
        // This is likely a bot! Do not process the form but store their information.
        const ip = req.ip;
        // Fetch geolocation data
        let locationData = null;
        try {
            let geoResponse = null;
            if (ip === '127.0.0.1') {
                geoResponse = await axios.get(`https://ipinfo.io/json?token=7b89c9583bcecc`);
                console.log('Geolocation data:', geoResponse.data.city);
            }
            else {
                geoResponse = await axios.get(`https://ipinfo.io/${ip}/json?token=7b89c9583bcecc`);
                // console.log('Geolocation data:', geoResponse.data);
            }
            locationData = geoResponse.data;
            const userAgent = req.headers['user-agent'];
        } catch (error) {
            console.error('Error fetching geolocation:', error);
        }

        const hackerData = {
            ip: ip,
            time: new Date().toISOString(),
            location: {
                city: locationData ? locationData.city : 'Unknown',
                region: locationData ? locationData.region : 'Unknown',
                country: locationData ? locationData.country : 'Unknown',
            }  // Save the geolocation data
        };
        potentialHackers.push(hackerData);
        // console.log('Potential hacker detected:', hackerData);

        return res.send('Thanks for the feedback!');
    }
    // Process the genuine feedback here.
    return res.send('Thanks for the genuine feedback!');
});

honeypotApp.post('/submit_feedback', async (req, res) => {
    if (req.body.honeypot) {
        // This is likely a bot! Do not process the form but store their information.
        const ip = req.ip;
        // Fetch geolocation data
        let locationData = null;
        try {
            let geoResponse = null;
            if (ip === '127.0.0.1') {
                geoResponse = await axios.get(`https://ipinfo.io/json?token=7b89c9583bcecc`);
                console.log('Geolocation data:', geoResponse.data.city);
            }
            else {
                geoResponse = await axios.get(`https://ipinfo.io/${ip}/json?token=7b89c9583bcecc`);
                // console.log('Geolocation data:', geoResponse.data);
            }
            locationData = geoResponse.data;
            const userAgent = req.headers['user-agent'];
        } catch (error) {
            console.error('Error fetching geolocation:', error);
        }

        const hackerData = {
            ip: ip,
            time: new Date().toISOString(),
            location: {
                city: locationData ? locationData.city : 'Unknown',
                region: locationData ? locationData.region : 'Unknown',
                country: locationData ? locationData.country : 'Unknown',
            }  // Save the geolocation data
        };
        potentialHackers.push(hackerData);
        // console.log('Potential hacker detected:', hackerData);

        return res.send('Thanks for the feedback!');
    }
    // Process the genuine feedback here.
    return res.send('Thanks for the genuine feedback!');
});

realApp.get('/hackers', (req, res) => {
    return res.json(potentialHackers);
});

const realServer = realApp.listen(443, '0.0.0.0', () => {
    console.log('Server running on port 443');
});

const honeypotServer = honeypotApp.listen(80, '0.0.0.0', () => {
    console.log('Honeypot running on port 80');
});
