#!/bin/bash

build() {
    echo 'building extension'
    export NODE_ENV=production
    export BABEL_ENV=$NODE_ENV

    rm -rf dist/*

    export INLINE_RUNTIME_CHUNK=false
    export GENERATE_SOURCEMAP=true

    export PATH=node_modules/.bin:$PATH
    craco build

    mkdir -p dist
    cp -r build/* dist
    # cp dist/index.html dist/index.html
}

build
