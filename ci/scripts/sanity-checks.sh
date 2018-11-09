#!/bin/bash

# Useful sanity checks to ensure that we are doing the proper things in the proper environment.

# Test the dist/ output for instances of mozilla.com and allizom.org
TEST_PATHS="/js/main.js /js/main.js.map /fonts/open-sans-400.woff /fonts/open-sans-600.woff /css/fonts.css \
  /css/styles.css /index.html"
COMMIT_ID=$(git rev-parse --short HEAD)
if [ -z "$TEST_BAD_CONFIG_PATHS" -o -z "$CDN_BASE_URL" ]; then
  echo "Make sure the TEST_BAD_CONFIG_PATHS and CDN_BASE_URL environment variables are set. Aborting"
  exit 1
fi

function test_url_ok() {
  # Returns 0/true if the URL was fetched successfully
  URLPATH="$1"
  curl -s -f -I "${CDN_BASE_URL}/${COMMIT_ID}${URLPATH}"
}

function test_config_contain() {
  # Returns 0/true if the pattern is found, thus 1/false if the pattern is not found
  pattern="$1"
  grep -ri ${pattern} dist/*
}

function fatal() {
  echo "FATAL: $@"
  exit 127
}


echo "Running sanity checks (Commit id: ${COMMIT_ID}, CDN: ${CDN_BASE_URL})"

# Is the configuration matching the environment?
# It must NOT contain the path from the opposite env (ie no "dev path" in prod env)
for tpath in ${TEST_BAD_CONFIG_PATHS}; do
  test_config_contain "$tpath" && {
    fatal "Configuration does not match environment (files in /dist contain $tpath)"
  }
done

# Are the files for this commit_id present in the CDN?
for tpath in ${TEST_PATHS}; do
  test_url_ok "$tpath" || {
    fatal "URL $tpath check failed"
  }
done

grep "${CDN_BASE_URL}/${COMMIT_ID}" dist/index.html || {
  fatal "dist/index.html does not match environment's COMMIT_ID: ${COMMIT_ID}"
}

echo "All checks passed"
