const { restClient } = require('@polygon.io/client-js');
const rest = restClient("RZU2_KdjbQkn968_4PHTUPz0qaEGbRHw");

async function barMaker(symbol, time, res){
  currentTime = Date.now();
  var startTime = currentTime - (time * 86400000);
  let data = await rest.stocks.aggregates(symbol, 1, "day", startTime, currentTime).catch(e => {
    res.redirect('http://localhost:3000/predict')
    console.error('An error happened:', e);
  });
  bars = data.results;
  let bars_close = [];
  for (bar of bars){
    bars_close.push(bar.c);
  };
  return bars_close;
}

async function serverBarMaker(symbol, time){
    currentTime = Date.now();
    var startTime = currentTime - (time * 86400000);
    let data = await rest.stocks.aggregates(symbol, 1, "day", startTime, currentTime).catch(e => {
      console.error('An error happened:', e);
    });
    bars = data.results;
    let bars_close = [];
    for (bar of bars){
      bars_close.push(bar.c);
    };
    return bars_close;
  }

module.exports = {barMaker, serverBarMaker};