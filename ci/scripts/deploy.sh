#!/bin/bash

# Prep this container to run python3
yum update -y
yum install python34 python34-devel python34-virtualenv -y
virtualenv-3.4 env -p python3
source env/bin/activate

pip3 install auth0-ci
pip3 install awscli

CLIENT_ID=$(aws ssm get-parameters --names /iam/nlx/deploy_client_id --query Parameters[0].Value)
CLIENT_SECRET=$(aws ssm get-parameters --names /iam/nlx/deploy_client_secret --with-decryption --query Parameters[0].Value)
LOCK_CLIENT_ID=$(aws ssm get-parameters --names /iam/nlx/lock_client_id --query Parameters[0].Value)
AUTH0_URL=$(aws ssm get-parameters --names /iam/nlx/auth0_url --query Parameters[0].Value)

# Actually deploy the lock
python3 env/bin/uploader_login_page.py -u $AUTH0_URL -c $CLIENT_ID -s $CLIENT_SECRET --default-client $LOCK_CLIENT_ID --login-page dist/index.html
