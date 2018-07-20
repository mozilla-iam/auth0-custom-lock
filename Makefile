CACHE			:= --no-cache
DKR_HUB			:= mozillaiam
IMG_NAME		:= auth0-custom-lock-builder

# Possible environments {DEV,PROD}
CLOUDFRONT_DIST_ID_DEV	:= E3B9GI6602TZBY
CDN_BUCKET_NAME_DEV	:= sso-dashboard.configuration
NODE_ENV_DEV		:= development
CLOUDFRONT_DIST_ID_PROD	:= E2AENIS3M2FKJL
CDN_BUCKET_NAME_PROD	:= sso-dashboard.configuration-prod
NODE_ENV_PROD		:= production
COMMIT_ID		:= $(shell git rev-parse --short HEAD)

# Default to dev
CDN_BUCKET_NAME		= $(CDN_BUCKET_NAME_DEV)
CLOUDFRONT_DIST_ID	= $(CLOUDFRONT_DIST_ID_DEV)
NODE_ENV		= $(NODE_ENV_DEV)

all:
	@echo 'Available make targets:'
	@grep '^[^#[:space:]].*:' Makefile
	@echo
	@echo 'In order to build within docker, type `./dmake <target>`'


## Deployment targets - these are shortcuts with preset variables for each environment
# You may also call targets individually as long as you set the correct env or are OK with defaulting to dev. Eg:
# `CLOUDFRONT_DIST_ID=xxxx make invalidate-cfn-cache`
deploy: CDN_BUCKET_NAME=$(CDN_BUCKET_NAME_DEV)
deploy: CLOUDFRONT_DIST_ID=$(CLOUDFRONT_DIST_ID_DEV)
deploy: NODE_ENV=$(NODE_ENV_DEV)
deploy: push-to-auth0 invalidate-cfn-cache

deploy-prod: CDN_BUCKET_NAME=$(CDN_BUCKET_NAME_PROD)
deploy-prod: NODE_ENV=$(NODE_ENV_PROD)
deploy-prod: CLOUDFRONT_DIST_ID=$(CLOUDFRONT_DIST_ID_PROD)
deploy-prod: push-to-auth0 invalidate-cfn-cache

invalidate-cfn-cache:
	@echo "Invalidating Cloudfront cache..."
	aws cloudfront create-invalidation --distribution-id $(CLOUDFRONT_DIST_ID) --paths /nlx/*

push-to-auth0: sanity-checks
	@echo "Deploying to auth0..."
	ci/scripts/03-deploy-to-auth0.sh

sanity-checks: copy-to-cdn
	@echo "Running sanity script for $(NODE_ENV)..."
	NODE_ENV=$(NODE_ENV) ci/scripts/02-sanity-checks.sh

copy-to-cdn:
	@echo "Copying resources to CDN..."
	aws s3api put-object --bucket $(CDN_BUCKET_NAME) --key nlx/latest/index.html --body dist/index.html
	aws s3 sync dist/ s3://$(CDN_BUCKET_NAME)/nlx/latest/
	# Send this to the commit ID as well for posterity
	aws s3api put-object --bucket $(CDN_BUCKET_NAME) --key nlx/$(COMMIT_ID)/index.html --body dist/index.html
	aws s3 sync dist/ s3://$(CDN_BUCKET_NAME)/nlx/$(COMMIT_ID)/

## Build and management targets
build-prod: NODE_ENV=$(NODE_ENV_DEV)
build: .installdeps
	npm run build

build-prod: NODE_ENV=$(NODE_ENV_PROD)
build-prod: .installdeps
	npm run build

start:
	npm start

.installdeps: .npm_lazy-start
	npm install
	touch .installdeps

.npm_lazy-start:
	@echo Starting npm_lazy...
	npm_lazy &
	echo $$! > $@
	npm config set registry http://localhost:8080/

npm_lazy-stop: .npm_lazy-start
	kill $(cat $<)
	rm $<

dkrbuild: Dockerfile
	docker build $(CACHE) -t $(IMG_NAME):latest .

hub:
	docker login
	docker tag $(IMG_NAME):latest $(DKR_HUB)/$(IMG_NAME)
	docker push $(DKR_HUB)/$(IMG_NAME)

clean:
	rm -rf node_modules
	rm -rf dist
	rm -f .installdeps
	rm -f .npm_lazy-start

.PHONY: all dkrbuild hub clean
