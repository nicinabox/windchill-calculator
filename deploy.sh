#!/bin/bash

webpack -p

rm -rf dist
mkdir -p dist
cp public/* dist
cp build/*.js dist

surge dist -d windchill.surge.sh
