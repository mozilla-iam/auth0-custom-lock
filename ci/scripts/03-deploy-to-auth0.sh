#!/bin/bash

[[ -z "${CLIENT_SECRET}" ]] && {
  echo 'Fetching CLIENT_SECRET from SSM'
  export CLIENT_SECRET=$(aws ssm get-parameters --names /iam/nlx/deploy_client_secret --with-decryption --query Parameters[0].Value | sed s/\"//g)
}

echo 'Deploying nlx to the auth0 tenant now.'
# Actually deploy the lock
uploader_login_page.py -u $AUTH0_URL -c $CLIENT_ID -s $CLIENT_SECRET --default-client $LOCK_CLIENT_ID --login-page dist/index.html
