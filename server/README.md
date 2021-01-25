# Data server, essentially a wrapper around sql db providing post and get

## Features
+ store and serve sensors descriptions
+ get, store and serve data linked with source sensor

## .env file

```
PORT=3366
```

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
