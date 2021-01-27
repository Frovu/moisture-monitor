var dates = [];
var moistures = [];
var temperatures = [];
var data = [];
var graph;

// initial data
getDevices().then(function (response) {
    let deviceID = Object.keys(response)[0];
    getData(deviceID).then(function (response) {
        let rows = response["rows"];
        rows.forEach((row) => dates.push(new Date(row[0]))); 
        rows.forEach((row) => moistures.push(row[1])); 
        rows.forEach((row) => temperatures.push(row[2])); 
        
        dates.forEach((date, i) => data.push([date, moistures[i], temperatures[i]]));
        plot();
    });
});

function plot () {
    graph = new Dygraph(document.getElementById("div_g"), data,
    {
        title: "Moisture Sensor",
        showRoller: true,
        strokeWidth: 2.0,
        labels: ['Date', 'Moisture', 'Temperature'],
        ylabel: 'Moisture Axis',
        y2label: 'Temperature Axis',
        series: {
            'Moisture': {
                axis: 'y1'
            },
            'Temperature': {
                axis: 'y2'
            }
        },
        axes: {
            y1: {
                valueRange: [650, 750],
                labelsKMB: true
            }
          },
    });

    // GET "update"?
    window.intervalId = setInterval(function() {
        getDevices().then(function (response) {
            let deviceID = Object.keys(response)[0];
            getData(deviceID).then(function (response) {
                let rows = response["rows"];
                rows.forEach((row) => dates.push(new Date(row[0]))); 
                rows.forEach((row) => moistures.push(row[1])); 
                rows.forEach((row) => temperatures.push(row[2])); 

                dates.forEach((date, i) => data.push([date, moistures[i], temperatures[i]]));
                graph.updateOptions( { 'file': data } );
            });
        });
        console.log("updated");
    }, 10000);
}

function ready () {

}

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