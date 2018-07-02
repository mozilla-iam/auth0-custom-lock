#!/bin/bash

COMMIT_ID=`git rev-parse --short HEAD`

# Send this commit to latest
aws s3api put-object --bucket $CDN_BUCKET_NAME --key nlx/latest/index.html --body dist/index.html
aws s3 sync dist/ s3://$CDN_BUCKET_NAME/nlx/latest/

# Send this to the commit ID as well for posterity
aws s3api put-object --bucket $CDN_BUCKET_NAME --key nlx/$COMMIT_ID/index.html --body dist/index.html
aws s3 sync dist/ s3://$CDN_BUCKET_NAME/nlx/$COMMIT_ID/
