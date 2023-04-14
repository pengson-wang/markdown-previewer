PATH := ./node_modules/.bin:${PATH}

.PHONY: bootstrap cleanup public build-scripts-dev build-scripts sample_doc compile dev build@alpha build deploy

bootstrap:
	yarn install

cleanup:
	mkdir -p dist
	rm -rf dist/**

public:
	cp -R public/* dist

build-scripts-dev: cleanup public
	export NODE_ENV=development; \
	vite build -c vite.config.script.ts

build-scripts: cleanup public
	export NODE_ENV=production; \
	vite build -c vite.config.script.ts

dev: build-scripts-dev
	export NODE_ENV=development; \
	vite -c vite.config.ts

build: 
	export NODE_ENV=production; \
  vite build -c vite.config.ts

publish: build
	lerna run publish