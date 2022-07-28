#!/bin/bash

build() {
    echo 'building extension'
    export NODE_ENV=production
    export BABEL_ENV=$NODE_ENV
    export INLINE_RUNTIME_CHUNK=false
    export GENERATE_SOURCEMAP=true
    export PATH=node_modules/.bin:$PATH

    craco build
}

build
