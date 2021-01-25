# Data server, essentially a wrapper around sql db providing post and get

## Features
+ store and serve sensors descriptions
+ get, store and serve data linked with source sensor

## .env file

```
PORT=3366
DB_USER=moisture
DB_NAME=moisture
DB_HOST=
DB_PASSWORD=
DB_PORT=5432
```

## API ref

`GET /api/data`
Query (optional): `?[from=tstamp][&to=tstamp]`
Returns object

`GET /api/devices`

`POST /api/data`

## sql structure

CREATE TABLE data (
	id SERIAL PRIMARY KEY,
	at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	dev integer NOT NULL,
	temperature real,
	moisture real,
);

CREATE TABLE devices (
	id SERIAL PRIMARY KEY,
	key TEXT NOT NULL,
	description TEXT
);
