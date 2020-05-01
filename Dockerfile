FROM node:14
MAINTAINER April King <april@mozilla.com>

RUN mkdir /nlx
WORKDIR /nlx

# Get the container OS up to date
RUN apt-get update
RUN apt-get upgrade -y

# Auth0 cli requires python3.
RUN apt-get update
RUN apt-get install -y \
  build-essential libssl-dev libffi-dev python-dev \
  python3.5 python3.5-dev python3-pip python-virtualenv
RUN apt-get clean

# Set python3 as the default since no other python runs in this container.
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3.5 2

# Install tools for running deploys to auth0 tenants.
RUN pip3 install --upgrade pip
RUN pip3 install auth0-ci
RUN pip3 install awscli

# Install npm_lazy to use as a local cache for failures retrieving from NPM.
## Setup the container for caching the node modules in case of npm repository failures.
ADD package.json package.json
ADD package-lock.json package-lock.json
ADD ci/ ci
RUN npm install -g npm_lazy && \
  npm install -g gulp-cli && \
  npm install gulp
RUN /bin/sh ci/scripts/docker-cache-node-modules.sh
# Cleanup
RUN rm /nlx/package.json /nlx/package-lock.json && \
  rm -rf /nlx/ci && \
  rm /root/.npmrc
