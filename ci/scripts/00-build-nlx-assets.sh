#!/bin/bash

# Start up npm_lazy and prefer to use it to the internet.
npm_lazy &
npm config set registry http://localhost:8080/
echo 'npm_lazy initialized.  Proceeding to cleaning the environment of old build artifacts.'

# Clean the environment
rm -rf node_modules/
rm -rf dist/
mkdir -p dist/

echo 'Building the lock for' ${NODE_ENV}

# Run a install and build
npm install
npm run build

echo 'Build is complete.  Please inspect the output in the dist/ directory.'
