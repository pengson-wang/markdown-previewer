#!/bin/bash

build() {
    echo 'building extension/iframe'
    export NODE_ENV=production
    export BABEL_ENV=$NODE_ENV
    export INLINE_RUNTIME_CHUNK=false
    export GENERATE_SOURCEMAP=true
    export PATH=node_modules/.bin:$PATH

    craco build
    mkdir -p build/static/css/highlight.js
    cp -r ../../node_modules/highlight.js/styles/* build/static/css/highlight.js
}

build
