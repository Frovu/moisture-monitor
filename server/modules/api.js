const express = require('express');
const router = express.Router();
const db = require('./database');

router.get('/devices', async (req, res) => {
	res.sendStatus(501);
});

router.get('/data', async (req, res) => {
	const resp = await db.select(req.query);
	if(resp)
		res.status(200).json(resp);
	else
		res.sendStatus(500);
});

router.post('/data', async (req, res) => {
	try {
		const data = typeof req.body === 'object' && db.validateData(req.body, 'data');
		if(!data)
			return res.sendStatus(400);
		const dev = db.authorize(req.body.dev);
		if(!dev) // not a known device key
			return res.sendStatus(401);
		await db.insert(dev, data, 'data');
		res.sendStatus(200);
	} catch (e) {
		global.log(`ERROR: (POST heart/data) ${e.stack}`);
		return res.sendStatus(500);
	}
});

module.exports = router;
