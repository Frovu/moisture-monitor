window.intervals = [];
// initial data
getDevices().then((response) => {
	const deviceID = Object.keys(response)[0];
	plot(deviceID);
});

const FIELD_TO_LABEL = {
	moisture: 'Moisture',
	temperature: 'Temperature',
	date: 'Date'
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
	window.intervals.push(setInterval(() => {
		getData(devId)
			.then(data => graph.updateOptions({'file': data.rows}));
		console.log('updated');
	}, 10000));
}

async function getDevices() {
	const response = await fetch('api/devices');
	if(response && response.ok)
		return await response.json();
	//show_error("Server didn't respond or some error occured");
	return null;
}

async function getData(devId) {
	const response = await fetch(`api/data?dev=${devId}`);
	if(!response || !response.ok)
		return null;
	//show_error("Server didn't respond or some error occured");
	return await response.json();
}
