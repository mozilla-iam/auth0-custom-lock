#!/bin/bash

# Useful sanity checks to ensure that we are doing the proper things in the proper environment.

# Test the dist/ output for instances of mozilla.com and allizom.org
NLX_ENV=${NODE_ENV}

echo 'Running sanity checks for' ${NLX_ENV}

if [ ${NLX_ENV} == 'production' ]
then echo 'Production environment detected.  Testing the dist/ output for instances of allizom.org and other dev vars.';

CDN_BASE_URL='https://cdn.sso.mozilla.com/nlx'
FAILURES=0
FAILURES=$[${FAILURES} + `grep -r -i 'auth-dev.mozilla.auth0.com' dist/* | wc -l`]
FAILURES=$[${FAILURES} + `grep -r -i 'allizom.org' dist/* | wc -l`]

  if [ ${FAILURES} != 0 ]
    then
      echo 'The wrong configuration was loaded in the dist/ files.  Failing deploy.  Number of failures: ' ${FAILURES}
      exit 1;
  fi

  echo 'No failures detected.  Configuration tests passed.'

fi

if [ ${NLX_ENV} == 'development' ]
then echo 'Development environment detected.  Testing the dist/ output for instances of mozilla.com and other prod vars';
CDN_BASE_URL='https://cdn.sso.allizom.org/nlx'
FAILURES=0
FAILURES=$[${FAILURES} + `grep -r -i 'auth.mozilla.auth0.com' dist/* | wc -l`]

  if [ ${FAILURES} != 0 ]
    then
      echo 'The wrong configuration was loaded in the dist/ files.  Failing deploy.  Number of failures: ' ${FAILURES}
      exit 1;
  fi

  echo 'No failures detected.  Configuration tests passed.'

fi

# Are the files for this commit_id present in the CDN

COMMIT_ID=`git rev-parse --short HEAD`
SUCCESS=0
SUCCESS=$[${SUCCESS} + `curl -I ${CDN_BASE_URL}/${COMMIT_ID}/js/main.js | grep 'HTTP/1.1 200 OK' | wc -l`]
SUCCESS=$[${SUCCESS} + `curl -I ${CDN_BASE_URL}/${COMMIT_ID}/js/main.js.map | grep 'HTTP/1.1 200 OK' | wc -l`]
SUCCESS=$[${SUCCESS} + `curl -I ${CDN_BASE_URL}/${COMMIT_ID}/fonts/open-sans-400.woff | grep 'HTTP/1.1 200 OK' | wc -l`]
SUCCESS=$[${SUCCESS} + `curl -I ${CDN_BASE_URL}/${COMMIT_ID}/fonts/open-sans-600.woff | grep 'HTTP/1.1 200 OK' | wc -l`]
SUCCESS=$[${SUCCESS} + `curl -I ${CDN_BASE_URL}/${COMMIT_ID}/css/fonts.css | grep 'HTTP/1.1 200 OK' | wc -l`]
SUCCESS=$[${SUCCESS} + `curl -I ${CDN_BASE_URL}/${COMMIT_ID}/css/styles.css | grep 'HTTP/1.1 200 OK' | wc -l`]
SUCCESS=$[${SUCCESS} + `curl -I ${CDN_BASE_URL}/${COMMIT_ID}/index.html | grep 'HTTP/1.1 200 OK' | wc -l`]

if [ ${SUCCESS} != 7 ]
  then echo 'Failed to verify files in CDN for' ${COMMIT_ID}'. Abort deploy.';
  exit 1
fi

echo 'Files present in CDN for' ${COMMIT_ID}.  'Proceeding to auth0 deploy.'
