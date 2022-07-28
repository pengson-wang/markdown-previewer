#!/bin/bash

deploy() {
    echo 'deploy react'
    export INLINE_RUNTIME_CHUNK=false
    export GENERATE_SOURCEMAP=false
    export PUBLIC_URL=https://pages.github.azc.ext.hp.com/pin-wang/chrome-extension-previewer
    export PATH=node_modules/.bin:$PATH
    react-scripts build
    gh-pages -d build
}

deploy