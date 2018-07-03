#!/bin/bash

# Invalidate assets in cloudfront
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DIST_ID --paths /nlx/*
