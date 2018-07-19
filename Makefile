CACHE			:= --no-cache
DKR_HUB			:= mozillaiam
IMG_NAME		:= auth0-custom-lock-builder

CLOUDFRONT_DIST_ID_DEV	:= E3B9GI6602TZBY
CDN_BUCKET_NAME_DEV	:= sso-dashboard.configuration
CLOUDFRONT_DIST_ID_PROD	:= E2AENIS3M2FKJL
CDN_BUCKET_NAME_PROD	:= sso-dashboard.configuration-prod
COMMIT_ID		:= $(shell git rev-parse --short HEAD)
CDN_BUCKET_NAME		= none

all:
	@echo 'Available make targets:'
	@grep '^[^#[:space:]].*:' Makefile
	@echo
	@echo 'In order to build within docker, type `./dmake <target>`'


## Deployment targets
deploy: CDN_BUCKET_NAME=$(CDN_BUCKET_NAME_DEV)
deploy: sanity-checks
	@echo "Deploying to auth0..."
	$(shell ci/scripts/03-deploy-to-auth0.sh)
	@echo "Invalidating Cloudfront cache..."
	aws cloudfront create-invalidation --distribution-id $(CLOUDFRONT_DIST_ID) --paths /nlx/*

deploy-prod: CDN_BUCKET_NAME=$(CDN_BUCKET_NAME_PROD)
deploy-prod: sanity-checks
	@echo "Deploying to auth0..."
	$(shell ci/scripts/03-deploy-to-auth0.sh)
	@echo "Invalidating Cloudfront cache..."
	aws cloudfront create-invalidation --distribution-id $(CLOUDFRONT_DIST_ID) --paths /nlx/*

sanity-checks: copy-to-cdn
	@echo "Running sanity script..."
	$(shell ci/scripts/02-sanity-checks.sh)

copy-to-cdn:
	@echo "Copying resources to CDN..."
	aws s3api put-object --bucket $(CDN_BUCKET_NAME) --key nlx/latest/index.html --body dist/index.html
	aws s3 sync dist/ s3://$(CDN_BUCKET_NAME)/nlx/latest/
	# Send this to the commit ID as well for posterity
	aws s3api put-object --bucket $(CDN_BUCKET_NAME) --key nlx/$(COMMIT_ID)/index.html --body dist/index.html
	aws s3 sync dist/ s3://$(CDN_BUCKET_NAME)/nlx/$(COMMIT_ID)/

## Build and management targets

build: .installdeps
	NODE_ENV=development npm run build

build-prod: .installdeps
	NODE_ENV=production npm run build

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
