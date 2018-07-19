# Using these scripts to deploy the auth0-custom-lock

## Building the container

You won't necessarily need to build the container.  But if you do you can build it with:

`docker build . -t mozillaiam/auth0-custom-lock-builder:latest`

## Assume the admin role

This assumes you have access to infosec-dev and infosec-prod for CDN and S3 access using regular boto credential handlers.

## Development

Deploying using this from your local machine.
```
docker run -ti -v ~/.aws:/root/.aws -v `pwd`:/nlx -e CDN_BUCKET_NAME=sso-dashboard.configuration -e NODE_ENV=development -e CLOUDFRONT_DIST_ID=E3B9GI6602TZBY mozillaiam/auth0-custom-lock-builder:latest /bin/bash
```

## Production

```
docker run -ti -v ~/.aws:/root/.aws -v `pwd`:/nlx -e CDN_BUCKET_NAME=sso-dashboard.configuration-prod -e NODE_ENV=production -e CLOUDFRONT_DIST_ID=E2AENIS3M2FKJL mozillaiam/auth0-custom-lock-builder:latest /bin/bash
```

Once inside the container run:

```bash
bash ci/scripts/00-build-nlx-assets.sh
bash ci/scripts/01-copy-to-cdn.sh
bash ci/scripts/02-sanity-checks.sh
bash ci/scripts/03-deploy-to-auth0.sh
bash ci/scripts/04-invalidate-cloudfront.sh
```

NLX should now be deployed.
