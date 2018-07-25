#!/bin/bash

# Useful sanity checks to ensure that we are doing the proper things in the proper environment.

# Test the dist/ output for instances of mozilla.com and allizom.org
TEST_PATHS="/js/main.js /js/main.js.map /fonts/open-sans-400.woff /fonts/open-sans-600.woff /css/fonts.css \
  /css/styles.css /index.html"
COMMIT_ID=$(git rev-parse --short HEAD)
[[ -z "$NODE_ENV" ]] && {
  NODE_ENV="development"
  echo "WARNING: Failed to read NODE_ENV from environment. Defaulting to $NODE_ENV"
}
if [ "$NODE_ENV" == 'production' ]; then
  CDN_BASE_URL='https://cdn.sso.mozilla.com/nlx'
  TEST_BAD_CONFIG_PATHS="auth-dev.mozilla.auth0.com allizom.org"
else
  CDN_BASE_URL='https://cdn.sso.allizom.org/nlx'
  TEST_BAD_CONFIG_PATHS="auth.mozilla.auth0.com"
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


echo "Running sanity checks for ${NODE_ENV} (Commit id: ${COMMIT_ID}, CDN: ${CDN_BASE_URL})"

# Is the configuration matching the environment?
# It must NOT contain the path from the opposite env (ie no "dev path" in prod env)
for tpath in ${TEST_BAD_CONFIG_PATHS}; do
  test_config_contain "$tpath" && {
    fatal "Configuration does not match environment ($NODE_ENV contains $tpath)"
  }
done

# Are the files for this commit_id present in the CDN?
for tpath in ${TEST_PATHS}; do
  test_url_ok "$tpath" || {
    fatal "URL $tpath check failed"
  }
done

echo "All checks passed"
