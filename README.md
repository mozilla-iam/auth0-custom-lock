# Auth0 Custom Lock

| description | status |
|------------ | ----------- |
| latest commit | ![](https://github.com/mozilla-iam/auth0-custom-lock/workflows/auth0-custom-lock-push/badge.svg)
| development release | ![](https://github.com/mozilla-iam/auth0-custom-lock/workflows/auth0-custom-lock-pre/badge.svg)
| production release | ![](https://github.com/mozilla-iam/auth0-custom-lock/workflows/auth0-custom-lock-prod/badge.svg)

The `auth0-custom-lock` repo contains the code behind the Mozilla New Login Experience (NLX) which is the single sign on (SSO) web interface that users log into to access Mozilla properties.

The original customized Auth0 lock, which can be found in [`mozilla-iam/auth0-deploy`](https://github.com/mozilla-iam/auth0-deploy/tree/2a09a74e4deb869f063ee8895916d74027eb65ad/pages) from [2016 to 2017](https://github.com/mozilla-iam/auth0-deploy/compare/3ba9e054e89fafcf48b2874a6b2fdffdc64c59a0...2a09a74e4deb869f063ee8895916d74027eb65ad), was succeeded by NLX, also tracked in `mozilla-iam/auth0-deploy` until NLX was moved to this repo in 2018. This repository currently relies on the [IAM API](https://github.com/mozilla-iam/iam-api) to check whether or not a user is in LDAP.

## Build tools

This project uses Gulp to run a number of automated tasks, including one that grabs our source files (HTML, Sass, JS)
and compiles them into a single JS file which is deployed to a CDN and referenced by the hosted HTML page in Auth0.

When the project was built successfully, you should get a `dist` folder, with the generated HTML.

### Building the page

To develop with a local webserver and automatic page refresh, simply run:

```bash
npm run watch
```

If you simply want to build the files, you can run:

```bash
npm run build
```

These both run with the settings in `config/local.json`, although in the rare circumstance that you want to build
development or production directly, simply run `NODE_ENV=development npm run build` or
`NODE_ENV=production npm run build`.

To build for development or production, simply tag the repo with `_version_-pre` or `_version_-prod` tags, and GitHub
should build and deploy. You can also build directly with `NODE_ENV=development npm run build` or
`NODE_ENV=production npm run build`, although this should generally not be necessary.

### Deploying code automatically

The long-term plan is to have both development and production code deployed automatically via GitHub Actions. The
process for that will be to tag the `master` branch with either a _version_-pre or _version_-prod tag. However,
this currently only works for development. Until GitHub Actions have completed evaluation, deployments to production
must be done manually via the process below.

### Deploying code manually ###

It shouldn't be necessary to deploy development code manually, as you can tag a commit with a `_version_-pre` tag
to rebuild.

If you do need to deploy manually (as is currently required for production), you can install
[act](https://github.com/nektos/act) on a local machine, and run:
`act --secret-file config/secrets -j dev-build-and-deploy` or
`act --secret-file config/secrets -j prod-build-and-deploy`.

Note that to run `act`, you may need to add the following to your `~/.actrc` for the build to properly function:
`-P ubuntu-latest=nektos/act-environments-ubuntu:18.04`.

You'll also need to set your secrets file to contain the following environmental variables:

```
# these are needed to invoke `act --secret-file config/secrets -j dev-build-and-deploy`
DEVELOPMENT_AWS_ACCESS_KEY_ID=...
DEVELOPMENT_AWS_SECRET_ACCESS_KEY=...
DEVELOPMENT_AWS_CDN_BUCKET_NAME=...
DEVELOPMENT_AUTH0_CLIENT_ID=...
DEVELOPMENT_AUTH0_CLIENT_SECRET=...

# these are needed to invoke `act --secret-file config/secrets -j prod-build-and-deploy`
PRODUCTION_AWS_ACCESS_KEY_ID=...
PRODUCTION_AWS_SECRET_ACCESS_KEY=...
PRODUCTION_AWS_CDN_BUCKET_NAME=...
PRODUCTION_AUTH0_CLIENT_ID=...
PRODUCTION_AUTH0_CLIENT_SECRET=...
```

Contact a member of the IT Web SRE team for a copy of these credentials, or push to the repo and create
a release to deploy to development. These credentials are currently kept in the IT Web SRE 1Password
vault.


## Coding standards

This project contains config files for the editor, ESLint and SCSS-Lint.

## Environment variables

Throughout the project, we have some variables that are environment specific, for example the URL that Auth0 connects
to. They are set in the `config` folder, following `environment-name.json` as a naming pattern. Note that these are no
"shell environment variable".

We can then use them anywhere in the codebase, as `index.html` is ran through Mustache, which will replace the variables
with the values the environment needs.

### Using the variables in JavaScript

All variables are assigned to the global `NLX` object in main.js and are be used throughout the JavaScript as
`NLX.variable`.

### Boolean variables

Because only in strings the Mustache syntax can produce valid JavaScript, we save booleans as strings (`'true'` and
`'false'`). They can then easily be turned into booleans:

```js
NLX.variable === 'true' // true or false
```

### Adding a new environment variable

Add new variables in three places:

* in any `config` you use, by default that is `config/local.json`, `config/development.json`, and `config/production.json`
* in `index.html`, all the way at the bottom of the file. We print the variable values there, so that we can merge them
  into one settings file with the settings Auth0 provides through `@@config@@`.

## Maintenance banner

NLX comes with a maintenance banner that can be triggered by setting the `features.maintenance_mode` to `"true"`. If you
need a maintenance banner, build NLX again with that variable set to `"true"`, or, even quicker, set the variable to
`"true"` in the already built HTML file.

## Parameters for special screens

When you call NLX with one of the following parameters, the standard interactive screen is not shown, instead you will
get a special screen.

### action=autologin_settings

Auto-login Settings screen. Allows user to enable or disable auto-login.

### account_verification=true

This is a specific parameter that is set when the log in screen is used for _account verification_.

## Backend setup

First, run the CloudFormation template in AWS. Currently, this is done in the `infosec-dev` and `infosec-prod` AWS accounts.
This will generate the `environment_AWS_ACCESS_KEY_ID` and `environment_AWS_SECRET_ACCESS_KEY` values needed to run `act` or
invoke the GitHub Action.

Secondly, create an Application in Auth0 with the correct scopes to the Auth0 Management API:

application name: `github.com/mozilla-iam/auth0-custom-lock`
application type: Machine to Machine
description: `Owner: Mozilla-IAM (Your Name)`
apis: Auth0 Management API
scopes: `read:clients`, `update:clients`, `read:client_keys`, `update:client_keys`, `update:tenant_settings`

This will generate the `environment_AUTH0_CLIENT_ID` and `environment_AUTH0_CLIENT_SECRET` needed to run `a0deploy` inside
the GitHub action.

## Password Manager Analytics

The Auth0 Custom Lock (NLX) reports [analytics about how users type their
passwords](https://github.com/mozilla-iam/auth0-custom-lock/blob/master/src/js/decorators/track-password-manager-usage.js)
in to differentiate between users who hand type passwords and users who machine
enter passwords (either password manager or copy/paste) as a signal about the
prevalence of password manager use.

The data can be viewed in Google Analytics in the `Mozilla Corporation` parent
under the `Mozilla (ParSys Websites)` account under the `NLX (aka Auth0 Lock)`
(`UA-84301250-4`) property in the
`Auth0 Lock All Web Site Data` view. Within this view navigate to `Behavior`...
`Events` and filter by `Event Category` of `Password entry`. Look for the
`Event Action` of either `Machine` or `Human` indicating which type of password
entry was performed.
