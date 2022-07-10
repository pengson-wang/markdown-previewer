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
	export RENDER_CONTAINER_URL=http://localhost:3000; \
	lerna run build
	cp -R packages/chrome/dist/* dist

build-scripts: cleanup public
	export NODE_ENV=production; \
	export RENDER_CONTAINER_URL=https://pengson-wang.github.io/markdown-previewer/renderer-container/; \
	lerna run build
	cp -R packages/chrome/dist/* dist

dev: build-scripts-dev
	export NODE_ENV=development; \
	lerna run start:iframe

build: build-scripts
	export NODE_ENV=production; \
  lerna run build:iframe

publish: build
	lerna run publish