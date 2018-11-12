CACHE			:= --no-cache
DKR_HUB			:= mozillaiam
IMG_NAME		:= auth0-custom-lock-builder
COMMIT_ID		:= $(shell git rev-parse --short HEAD)

# Default to dev settings
CLOUDFRONT_DIST_ID	?= E3B9GI6602TZBY
CDN_BUCKET_NAME		?= sso-dashboard.configuration
NODE_ENV		?= development
CDN_BASE_URL		?= https://cdn.sso.allizom.org/nlx
TEST_BAD_CONFIG_PATHS	?= auth.mozilla.auth0.com
# Auth0 dev defaults
CLIENT_ID		?= jwBjjyo7NNmTfKpZ6ibm54w3TNRH5Mu7
CLIENT_SECRET		?=
LOCK_CLIENT_ID		?= VNGM4quJw3Nhx28j8XKVYmu5LcPMCgAH
AUTH0_URL		?= auth-dev.mozilla.auth0.com

.PHONY: all $(MAKECMDGOALS)

all:
	@echo 'Available make targets:'
	@grep '^[^#[:space:]].*:' Makefile
	@echo
	@echo 'In order to build within docker, type `./dmake <target>`'

deploy: push-to-auth0 invalidate-cfn-cache
	@echo "Deployment completed ($(NODE_ENV))"

invalidate-cfn-cache:
	@echo "Invalidating Cloudfront cache..."
	aws cloudfront create-invalidation --distribution-id $(CLOUDFRONT_DIST_ID) --paths /nlx/*

push-to-auth0: sanity-checks
	@echo "Deploying to auth0..."
	uploader_login_page.py -u $(AUTH0_URL) -c $(CLIENT_ID) -s $(CLIENT_SECRET) \
	  --default-client $(LOCK_CLIENT_ID) --login-page dist/index.html

sanity-checks: copy-to-cdn
	@echo "Running sanity script for $(NODE_ENV)..."
	CDN_BASE_URL="$(CDN_BASE_URL)" \
	TEST_BAD_CONFIG_PATHS="$(TEST_BAD_CONFIG_PATHS)" \
	NODE_ENV="$(NODE_ENV)" \
	ci/scripts/sanity-checks.sh

copy-to-cdn:
	@echo "Backup resources from CDN..."
	mkdir -p /tmp/nlx-backup
	aws s3 sync s3://$(CDN_BUCKET_NAME)/nlx/latest/ /tmp/backup
	aws s3 sync /tmp/nlx-backup s3://$(CDN_BUCKET_NAME)/nlx/backup
	@echo "Copying resources to CDN..."
	aws s3api put-object --bucket $(CDN_BUCKET_NAME) --key nlx/latest/index.html --body dist/index.html
	aws s3 sync dist/ s3://$(CDN_BUCKET_NAME)/nlx/latest/
	# Send this to the commit ID as well for posterity
	aws s3api put-object --bucket $(CDN_BUCKET_NAME) --key nlx/$(COMMIT_ID)/index.html --body dist/index.html
	aws s3 sync dist/ s3://$(CDN_BUCKET_NAME)/nlx/$(COMMIT_ID)/

## Build and management targets
build: .installdeps
	npm run build

start:
	npm start

.installdeps: .npm_lazy-start
	npm install
	npm install --only=dev
	touch .installdeps

# This is an NPM cache in case NPM servers don't work correctly, which happens sometimes
.npm_lazy-start:
	@echo Starting npm_lazy...
	npm_lazy &
	echo $$! > $@
	npm config set registry http://localhost:8080/

npm_lazy-stop: .npm_lazy-start
	npm config delete registry
	kill $(cat $<)
	rm $<

dkrbuild: Dockerfile
	docker build $(CACHE) -t $(IMG_NAME):latest .
	docker tag $(IMG_NAME):latest $(DKR_HUB)/$(IMG_NAME)

hub:
	docker login
	docker push $(DKR_HUB)/$(IMG_NAME)

clean:
	rm -rf node_modules
	rm -rf dist
	rm -f .installdeps
	rm -f .npm_lazy-start
