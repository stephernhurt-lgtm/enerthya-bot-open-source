build:
	yarn build

start:
	node dist/index.js

dev:
	yarn tsc --watch

test:
	yarn test

lint:
	yarn prettier --check src/

format:
	yarn prettier --write src/

clean:
	rm -rf dist/ logs/

.PHONY: build start dev test lint format clean
