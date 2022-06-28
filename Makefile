PATH := ./node_modules/.bin:${PATH}

.PHONY: bootstrap cleanup public build/scripts/dev build/scripts sample_doc compile dev build@alpha build deploy

bootstrap:
	yarn install

cleanup:
	mkdir -p dist
	rm -rf dist/**

public:
	cp -R public/* dist

build/scripts/dev: cleanup public
	export NODE_ENV=development; \
	# pnpm run -r --if-present build
	lerna run build
	cp -R packages/chrome/dist/* dist

build/scripts: cleanup public
	export NODE_ENV=production; \
	# pnpm run -r --if-present build
	lerna run build
	cp -R packages/chrome/dist/* dist

dev: build/scripts/dev
	export NODE_ENV=development; \
	# pnpm run -r --if-present start:iframe
	lerna run start:iframe

build: build/scripts
	export NODE_ENV=production; \
	# pnpm run -r --if-present build:iframe
  lerna run build:iframe
	cp -R packages/extension/dist/* dist

publish: build
	zip -r ~/Downloads/previewer.zip dist