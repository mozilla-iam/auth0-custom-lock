# Auth0 Custom Lock

[![Build Status](https://travis-ci.org/mozilla-iam/auth0-custom-lock.svg?branch=master)](https://travis-ci.org/mozilla-iam/auth0-custom-lock)

## Build tools

This project uses Gulp to run a number of automated tasks, including one that grabs our source files (HTML, Sass, JS)
and compiles them into a single JS file which is deployed to a CDN and referenced by the hosted HTML page in Auth0.

This project is also meant to be built in a Docker container to ensure you have all the necessary dependencies. This is
done by calling a tool named `dmake`. If you wish not to use the container, you can also simply call `make` directly.

For a list of all targets, simply type `make`.

When the project was built successfully, you should get a `dist` folder, with the generated HTML.

### Building the page

For development:
```bash
./dmake build
```

For production:
```bash
./dmake build-prod
```

### Deploying code

For local development:
```bash
./dmake start
```

This should start a local server and open it in the browser. It also starts a watch task. If you make any changes in
source files (HTML, Sass or JS), the `dist` folder will get rebuilt.

Make sure your AWS credentials are set correctly and use the proper role when deploying to these environment.

#### Deploying to Auth0-Dev automatically

An [AWS CodeBuild](https://docs.aws.amazon.com/codebuild/index.html#lang/en_us)
Project is deployed in the `infosec-dev` AWS account. This is used to build and
deploy the NLX code.

The CodeBuild Project is provisioned with the [`codebuild-job.yml` CloudFormation template](ci/cloudformation/codebuild-job.yml).
The CodeBuild Project uses an IAM Role, which gives it permissions to execute.
That IAM Role is provisioned with the [`codebuild-role.yml` CloudFormation template](ci/cloudformation/codebuild-role.yml).

The CodeBuild Project has an environment image set to `aws/codebuild/nodejs:8.11.0`
however the running CodeBuild Project has an environment image of `mozillaiam/auth0-custom-lock-builder`

[`mozillaiam/auth0-custom-lock-builder`](https://hub.docker.com/r/mozillaiam/auth0-custom-lock-builder/)
is a docker image built from the [`Dockerfile`](Dockerfile). This docker image
is created with the `dkrbuild` target of the [`Makefile`](Makefile) and uploaded
to Docker Hub with the `hub` target. This docker image has, among other things,
the [`mozilla-iam/auth0-ci`](https://github.com/mozilla-iam/auth0-ci/) python
module installed which will be used to make changes to Auth0

The [`mozilla-iam/auth0-custom-lock` GitHub repository](https://github.com/mozilla-iam/auth0-custom-lock)
has a [GitHub webhook](https://developer.github.com/webhooks/) configured which
will contact AWS CodeBuild each time someone does a git `push` to the repo. This
webhook makes this contact to https://codebuild.us-west-2.amazonaws.com/webhooks

The CodeBuild Project is configured with a [`branchFilter`](https://docs.aws.amazon.com/codebuild/latest/APIReference/API_Webhook.html#CodeBuild-Type-Webhook-branchFilter)
of `master` so that only pushes to the `master` branch in the git repo trigger
a CodeBuild run. It's unclear how this `branchFilter` is configured since the
CloudFormation template doesn't do it.

When the webhook triggers CodeBuild, CodeBuild executes the instructions in the
[`buildspec.yml`](buildspec.yml) file. The `buildspec.yml` in the repo isn't
currently be used by CodeBuild and instead a custom set of instructions has been
loaded in. PR #250 is open to attempt to reconcile this.

These `buildspec.yml` instructions tell CodeBuild to call the `build` target of
the [`Makefile`](Makefile) followed by the `copy-to-cdn` target and then the
`deploy` target.

The `build` uses `npm` to build the NLX code.

The `copy-to-cdn` uploads the built artifacts to the S3 CDN `sso-dashboard.configuration`

The `deploy` calls the [`03-deploy-to-auth0.sh`](ci/scripts/03-deploy-to-auth0.sh)
script which, using the installed [`mozilla-iam/auth0-ci`](https://github.com/mozilla-iam/auth0-ci/)
python module in the [`mozillaiam/auth0-custom-lock-builder`](https://hub.docker.com/r/mozillaiam/auth0-custom-lock-builder/)
environment image, calls the [`uploader_login_page.py` tool](https://github.com/mozilla-iam/auth0-ci/blob/master/uploader_login_page.py).

`uploader_login_page.py` calls Auth0 to update the client attributes of a special
"Default Client" in Auth0. This special reserved client (a relying party) has a
special attribute called `custom_login_page` which, when updated, updates the
hosted login page which is the [`src/html/index.html`](src/html/index.html) page.

This page references the S3 CDN URL now containing the built javascript artifacts.

#### Deploying to Auth0-Dev manually

For development:
```bash
./dmake deploy
```

#### Deploying to Auth0-Prod

For production:
```bash
./dmake deploy-prod
```

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

Add new variables in two places:

* in any `config` you use, by default that is `config/development.json` and `config/production.json`
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
