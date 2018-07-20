#!/bin/bash

echo 'Fetching parameters for deployment from AWS parameter store.'
export CLIENT_ID=$(aws ssm get-parameters --names /iam/nlx/deploy_client_id --query Parameters[0].Value | sed s/\"//g)
export CLIENT_SECRET=$(aws ssm get-parameters --names /iam/nlx/deploy_client_secret --with-decryption --query Parameters[0].Value | sed s/\"//g)
export LOCK_CLIENT_ID=$(aws ssm get-parameters --names /iam/nlx/lock_client_id --query Parameters[0].Value | sed s/\"//g)
export AUTH0_URL=$(aws ssm get-parameters --names /iam/nlx/auth0_url --query Parameters[0].Value | sed s/\"//g)

echo 'Deploying nlx to the auth0 tenant now.'
# Actually deploy the lock
uploader_login_page.py -u $AUTH0_URL -c $CLIENT_ID -s $CLIENT_SECRET --default-client $LOCK_CLIENT_ID --login-page dist/index.html
