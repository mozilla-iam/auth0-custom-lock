#!/bin/bash
trap 'kill $(jobs -p)' EXIT
npm_lazy &
npm config set registry http://localhost:8080/
npm install -g
