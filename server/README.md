# Data server, essentially a wrapper around sql db providing post and get

## API ref

### `GET /api/data`

Query ([]optional):

`?dev=<id>&[from=<tstamp>][&to=<tstamp>]`

Returns object:
+ `fields` - ordered array of field names
+ `rows` - 2d array of data, column order matches `fields`

### `GET /api/devices`

Returns 400 or 200 with object:
+ key - device `id` to be queried in `GET /api/data`
+ value - device description

### `POST /api/data`

Query:
```json
{
	"t": 13.37,
	"m": 1337,
	"dev": "test"
}
```

Responses 400, 401, 500 or 200

## Features
+ store and serve sensors descriptions
+ get, store and serve data linked with source sensor
+ authorize devices by some id and store link along with data

## .env file

```
PORT=3366
DB_USER=moisture
DB_NAME=moisture
DB_HOST=
DB_PASSWORD=
DB_PORT=5432
```

## sql structure

```sql
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
```
