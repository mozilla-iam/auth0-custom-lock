#!/bin/bash

# Prep this container to run python3
apt-get update
apt-get install -y build-essential libssl-dev libffi-dev python-dev
apt-get install -y python3.4-venv python3.4 python3.4-dev python3-pip python-virtualenv

virtualenv env -p python3
source env/bin/activate

pip3 install auth0-ci
pip3 install awscli

export CLIENT_ID=$(aws ssm get-parameters --names /iam/nlx/deploy_client_id --query Parameters[0].Value)
export CLIENT_SECRET=$(aws ssm get-parameters --names /iam/nlx/deploy_client_secret --with-decryption --query Parameters[0].Value)
export LOCK_CLIENT_ID=$(aws ssm get-parameters --names /iam/nlx/lock_client_id --query Parameters[0].Value)
export AUTH0_URL=$(aws ssm get-parameters --names /iam/nlx/auth0_url --query Parameters[0].Value)

# Actually deploy the lock
python3 env/bin/uploader_login_page.py -u $AUTH0_URL -c $CLIENT_ID -s $CLIENT_SECRET --default-client $LOCK_CLIENT_ID --login-page dist/index.html
