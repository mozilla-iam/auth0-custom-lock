#!/bin/bash

# Placeholder for future.
git clone https://github.com/mozilla-iam/auth0-ci.git

CLIENT_ID=$(aws ssm get-parameters --names /iam/nlx/deploy_client_id --query Parameters[0].Value)
CLIENT_SECRET=$(aws ssm get-parameters --names /iam/nlx/deploy_client_secret --with-decryption --query Parameters[0].Value)
LOCK_CLIENT_ID=$(aws ssm get-parameters --names /iam/nlx/lock_client_id --query Parameters[0].Value)
AUTH0_URL=$(aws ssm get-parameters --names /iam/nlx/auth0_url --query Parameters[0].Value)
pip install -r auth0-ci/requirements.txt

# Actually deploy the lock
python auth0-ci/uploader_login_page.py -u $AUTH0_URL -c $CLIENT_ID -s $CLIENT_SECRET --default-client $LOCK_CLIENT_ID --login-page dist/index.html
