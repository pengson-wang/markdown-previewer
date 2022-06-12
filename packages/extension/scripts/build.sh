#!/bin/bash

build() {
    echo 'building extension'
    export NODE_ENV=production
    export BABEL_ENV=$NODE_ENV

    rm -rf dist/*

    export INLINE_RUNTIME_CHUNK=false
    export GENERATE_SOURCEMAP=true

    export PATH=node_modules/.bin:$PATH
    react-scripts build

    mkdir -p dist
    cp -r build/* dist
    cp dist/index.html dist/iframe.html
}

build