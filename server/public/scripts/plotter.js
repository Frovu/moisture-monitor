window.intervals = [];
// initial data
getDevices().then((response) => {
	const devices = Object.keys(response);
	devices.forEach((device) => {
		let element = document.createElement("option");
		element.value = element.innerHTML = device;
		document.getElementById('devices').appendChild(element);
	});

	plot(document.getElementById('devices').value);
});

const FIELD_TO_LABEL = {
	moisture: 'Moisture 1',
	moisture2: 'Moisture 2',
	temperature: 'Temperature',
	voltage: 'Voltage',
	at: 'Date'
};

async function plot(devId) {
	const data = await getData(devId);
	const labels = data.fields.map(f => FIELD_TO_LABEL[f]);
	const graph = new Dygraph(document.getElementById('div_g'), data.rows,
		{
			title: 'Moisture Sensor',
			legend: 'always',
			showRoller: true,
			strokeWidth: 2.0,
			labels: labels,
			ylabel: 'Moisture Axis',
			y2label: 'Temperature Axis',
			series: {
				'Moisture 1': {
					axis: 'y1'
				},
				'Moisture 2': {
					axis: 'y1'
				},
				'Temperature': {
					axis: 'y2'
				},
				'Voltage': {
				 	axis: 'y1'
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
	window.intervals.push(setInterval(() => {
		getData(devId)
			.then(data => graph.updateOptions({'file': data.rows}));
		console.log('updated');
	}, 60000));
}

function ready() {}

async function getDevices() {
	const response = await fetch('api/devices');
	if(response && response.ok)
		return await response.json();
	//show_error("Server didn't respond or some error occured");
	return null;
}

async function getData(devId) {
	const response = await fetch(`api/data?dev=${devId}&from=${Date.now()/1000-3600*24*7}`);
	if(!response || !response.ok)
		return null;
	//show_error("Server didn't respond or some error occured");
	const data = await response.json();
	const dateField = data.fields.indexOf('at');
	data.rows.forEach((row, i) => {
		data.rows[i][dateField] = new Date(row[dateField]);
	});
	return data;
}
