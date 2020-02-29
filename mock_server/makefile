.DEFAULT_GOAL := start

PORT?=8086

start:
	npx json-server -w db.json --routes routes.json --port ${PORT}