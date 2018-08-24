#!/bin/bash

npm_lazy &
npm config set registry http://localhost:8080/
npm install -g
kill $(ps aux | grep 'npm_lazy' | awk '{print $2}')
