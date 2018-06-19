#!/bin/bash

# Clean the environment
rm -rf node_modules/
rm -rf dist/
mkdir -p dist/

echo 'Building the lock for' ${NODE_ENV}

# Run a install and build
npm install
npm run build
