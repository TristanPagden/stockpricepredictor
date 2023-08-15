const express = require('express');
const barGetter = require('./barGetter.js');
const model = require('./model.js');
const cors = require('cors');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');

const job = schedule.scheduleJob('0 0 * * *', function(){
    barGetter.serverBarMaker('SPY', 730).then((data) => {
        bars = data;
        model.trainModel(bars);
    }).catch(e => {
        console.error('An error happened:', e);
    });
});

const PORT = 8080;

const server = express()
server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(cors({
    origin: ['https://stockpricepredictor.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true

}));

server.get('/', (req, res) => {
    res.json('Success');
});

server.get('/api/train', (req) => {
    barGetter.serverBarMaker('SPY', 730).then((data) => {
        bars = data;
        model.trainModel(bars);
    }).catch(e => {
        console.error('An error happened:', e);
    });
});

server.post('/api/predict', (req, res) => {
    var ticker = req.body.ticker.toUpperCase();
    console.log('Ticker Entered: ' + ticker);

    var time = req.body.time;
    console.log('Time Entered: ' + time);
        
    barGetter.barMaker(ticker, 730).then((data) => {
        console.log('Got bars');
        var bars = data;
        model.runModel(bars, time, function(results) {
            console.log('Got results');
            res.json(results);
        });
    }).catch(e => {
        console.error('An error happened:', e);
    });
});

server.listen(PORT, () => {
    console.log('Listening on port ' + PORT);
});





