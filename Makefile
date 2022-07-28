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
	lerna run build
	cp -R packages/chrome/dist/* dist

build-scripts: cleanup public
	export NODE_ENV=production; \
	lerna run build
	cp -R packages/chrome/dist/* dist

dev: build-scripts-dev
	export NODE_ENV=development; \
	lerna run start:iframe

build: build-scripts
	export NODE_ENV=production; \
  lerna run build:iframe
	cp -R packages/iframe/build dist/iframe

publish: build
	lerna run publish