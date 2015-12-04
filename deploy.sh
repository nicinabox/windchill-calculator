#!/bin/bash

source .env

PRERELEASE=false webpack -p

rm -rf dist
mkdir -p dist
cp public/* dist
cp build/*.js dist
cp build/*.css dist

surge dist -d windchill.surge.sh
