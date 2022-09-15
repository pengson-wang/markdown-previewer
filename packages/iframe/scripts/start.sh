#!/bin/bash

start() {
  echo 'starting dev server of extension/iframe'
  export PATH=node_modules/.bin:$PATH

  mkdir -p public/static/css/highlight.js
  cp -r ../../node_modules/highlight.js/styles/* public/static/css/highlight.js
  craco start
}

start
