#!/bin/sh
node compile.js
./node_modules/typescript-formatter/bin/tsfmt -r dist/index.ts
