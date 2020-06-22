#!/bin/bash

# Useful sanity checks to ensure that we are doing the proper things in the proper environment.

# Test the dist/ output for instances of mozilla.com and allizom.org
TEST_PATHS="/js/main.js /js/main.js.map /fonts/open-sans-400.woff /fonts/open-sans-600.woff /css/fonts.css \
  /css/styles.css /index.html"
COMMIT_ID=$(git rev-parse HEAD)
CDN_BASE_URL="https://`cat config/$NODE_ENV.json | jq -r .cdn_domain`/nlx/$COMMIT_ID"

function fatal() {
  echo "FATAL: $@"
  exit 127
}

function test_url_ok() {
  # Returns 0/true if the URL was fetched successfully
  curl --silent --output /dev/null -I "${CDN_BASE_URL}$1" > /dev/null
}

echo "Running sanity checks (Commit id: ${COMMIT_ID}, CDN: ${CDN_BASE_URL})"

# Are the files for this commit_id present in the CDN?
for tpath in ${TEST_PATHS}; do
  test_url_ok "$tpath" || {
    fatal "URL $tpath check failed"
  }
done

if ! test -e dist/index.html; then
  fatal "dist/index.html is missing. Aborting."
fi

grep --silent "${CDN_BASE_URL}" dist/index.html || {
  fatal "dist/index.html does not match environment's COMMIT_ID: ${COMMIT_ID}"
}

echo "All sanity checks passed."
