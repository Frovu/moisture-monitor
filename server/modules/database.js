const Pool = require('pg').Pool;
const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
});

const FIELDS = {
	m: 'moisture',
	t: 'temperature',
};

const devices = {};
async function fetchDevices() {
	const res = await pool.query('SELECT * from devices');
	for(const row of res.rows)
		devices[row.key] = {id: row.id, desc: row.description};
	global.log(`devices auth keys: ${Object.keys(devices).join()}`);
}
fetchDevices();

function getDevices() {
	const dev = {};
	for(const d of Object.values(devices))
		dev[d.id] = d.desc;
	return dev;
}

function authorize(key) {
	return devices[key] && devices[key].id;
}

function validate(data) {
	const result = {};
	for(const f in FIELDS) {
		const val = parseFloat(data[f]);
		if(!val || isNaN(val))
			return false;
		result[FIELDS[f]] = val;
	}
	return Object.keys(result).length ? result : false;
}

async function insert(dev, data) {
	const fields = Object.keys(data); let i=1;
	const q = `INSERT INTO data (dev, ${fields.join(', ')}) VALUES ($1,${fields.map(()=>`$${++i}`).join(',')})`;
	await pool.query(q, [dev].concat(Object.values(data)));
}

async function select(params) {
	const dev = params.dev && Object.values(devices).find(d => d.id == params.dev);
	const from = params.from && parseInt(params.from);
	const to = params.to && parseInt(params.to);
	if(!dev || (from && isNaN(from)) || (to && isNaN(to)))
		return null;
	// cursed code here, golang devs would quite dislike it
	const q = `SELECT at,${Object.values(FIELDS).join()} FROM data WHERE dev=${dev.id}`
		+ (from?` AND at >= to_timestamp(${from})`:'') + (to?` AND at < to_timestamp(${to})`:'');
	try {
		const res = await pool.query({ rowMode: 'array', text: q});
		return {
			rows: res.rows,
			fields: res.fields.map(f => f.name)
		};
	} catch (e) {
		return null;
	}
}

module.exports.getDevices = getDevices;
module.exports.validate = validate;
module.exports.authorize = authorize;
module.exports.insert = insert;
module.exports.select = select;
