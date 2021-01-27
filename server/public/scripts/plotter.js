var dates = [];
var moistures = [];
var temperatures = [];
var data = [];

// initial data
getDevices().then(function (response) {
    let deviceID = Object.keys(response)[0];
    getData(deviceID).then(function (response) {
        let rows = response["rows"];

        rows.forEach((row) => dates.push(new Date(row[0]))); 
        rows.forEach((row) => moistures.push(row[1])); 
        rows.forEach((row) => temperatures.push(row[2])); 
        console.log(dates[0] + " " + temperatures[0]);

        //dates.forEach((date, i) => m.push([date, moistures[i]]));
        //dates.forEach((date, i) => t.push([date, temperatures[i]]));
        dates.forEach((date, i) => data.push([date, moistures[i], temperatures[i]]));
        plot();
    });
});

function plot () {
    new Dygraph(document.getElementById("div_g"), data,
    {
        title: "Moisture Sensor",
        showRoller: true,

        strokeWidth: 3.0,
        labels: ['Date', 'Moisture', 'Temperature'],
  
        axes: {
            y: {

                ticker: function(min, max, pixels, opts, dygraph, vals) {
                    return [{v:20, label:"20"}, {v:700, label:"700"}];
                }
            },
          }
    });

    // It sucks that these things aren't objects, and we need to store state in window.
    /*
    window.intervalId = setInterval(function() {
        getDevices().then(function (response) {
            let deviceID = Object.keys(response)[0];
            getData(deviceID).then(function (response) {
                //plot(response["fields"], response["rows"]);
                let rows = response["rows"];
                let newDate = row[rows.length-1];
                let newMoisture = row[rows.length-1];
                rows.forEach((row) => dates.push(row[0])); 
                rows.forEach((row) => moistures.push(row[1])); 
                rows.forEach((row) => temperatures.push(row[2])); 
            });
    });
    var x = new Date();  // current time
    var y = Math.random();
    t.push([x, y]);
    g.updateOptions( { 'file': t } );
    }, 1000);*/
}

function update () {

}

function ready () {

}

/*
function plot (fields, rows) {
    rows.forEach((row) => times.push(row[0])); 
    rows.forEach((row) => moistures.push(row[1])); 
    rows.forEach((row) => temperatures.push(row[2])); 

    new Dygraph(div, "ny-vs-sf.txt", {
        legend: 'always',
        title: 'NYC vs. SF',
        showRoller: true,
        rollPeriod: 14,
        customBars: true,
        ylabel: 'Temperature (F)',
    });
}*/

async function getDevices () {
    const response = await fetch('api/devices', {
        method: 'GET',
        credentials: "same-origin",
    }).catch((e) => {
        //show_error(e);
    });
    
    if(response && response.ok)
        return await response.json();
    //show_error("Server didn't respond or some error occured");
    return null;
}

async function getData () {
    const response = await fetch('api/data?dev=1', {
        method: 'GET',
        credentials: "same-origin",
    }).catch((e) => {
        //show_error(e);
    });
    
    if(response && response.ok)
        return await response.json();
    //show_error("Server didn't respond or some error occured");
    return null;
}