const express = require('express');
const path = require('path');
const parseUrl = require('parseurl');
const rp = require('request-promise');
const proxy = require('http-proxy-middleware');
const url = require('url');
const appendQuery = require('append-query');
const winston = require('winston');
const app = express();
const router =  express.Router();
const del = require('del');
const port = process.env.PORT || 6000;
const bodyParser = require('body-parser');
const cors = require('cors');
const cache = require('memory-cache');
const redis = require("redis");
const redisPort = process.env.REDIS_PORT || 6379;
const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const client = redis.createClient(redisPort, redisHost, {db:2});
const uniqid = require('uniqid');

client.on("error", (err) => console.log("Error " + err));

require('dotenv').config()

if(process.env.NODE_ENV === 'production') {
    console.log('Rendering server running in production mode');
    // Remove sourcemaps
    del(['client/build/static/*/*.map']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
    });
}

app.use(cors());
app.use(express.json());       
app.use(express.urlencoded()); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const getPaymentRequest = (req, res, next) => client.get(req.params.puid, (err, reply) => {
    req.data = reply;
    next();
});

const deletePaymentRequest = (req, res, next) => client.del(req.params.puid, (err, reply) => {
    console.log('reply: ', reply)
    console.log('err: ', err)
    next();
});

function setPaymentRequest(req, res, next){

    const puid = uniqid(JSON.parse(req.body.merchant).toLowerCase().replace(' ', '_')) + '_';
    const bodyStringify = JSON.stringify(req.body);
    client.set(puid, bodyStringify);
    req.data = {
        ...req.data,
        puid
    };
    next();
};

// Serve any static files
app.use('/', express.static(path.join(__dirname, 'client/build')));

app.post('/payment', setPaymentRequest, (req, res) => {
    res.redirect(301, `/payment?puid=${req.data.puid}`);
});

app.get('/getPaymentRequest/:puid', getPaymentRequest, (req, res) => res.json(JSON.parse(req.data)));

app.put('/paymentRequest/:puid', deletePaymentRequest, (req, res) => res.status(204).end());

// Handle React routing, return all requests to React app
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

  
app.listen(port, () => console.log(`avilable in http://localhost:${port}`));