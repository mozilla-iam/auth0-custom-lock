# Auth0 Custom Lock

![Build Status](https://github.com/mozilla-iam/auth0-custom-lock/workflows/.github/workflows/development.yml/badge.svg)

The `auth0-custom-lock` repo contains the code behind the Mozilla New Login Experience (NLX) which is the single sign on (SSO) web interface that users log into to access Mozilla properties.

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

To build for development or production, simply tag the repo with `development` or `production` tags, and GitHub
should build and deploy. You can also build directly with `NODE_ENV=development npm run build` or
`NODE_ENV=production npm run build`, although this should generally not be necessary.

### Deploying code automatically

Both development and production code is deployed automatically via GitHub actions. Simply tag the `master` branch
with either a development-_version_ or production-_version_ tag.

### Deploying code manually ###

It shouldn't be necessary to deploy code manually, as you can tag an old commit with a new tag to rebuild.

If you do need to deploy manually, you can install [act](https://github.com/nektos/act), and run
`act --secret-file config/secrets`. You'll need to set your secrets file to contain the following environmental
variables:

```
DEVELOPMENT_AWS_ACCESS_KEY_ID=...
DEVELOPMENT_AWS_SECRET_ACCESS_KEY=...
DEVELOPMENT_AWS_CDN_BUCKET_NAME=...
DEVELOPMENT_AUTH0_CLIENT_ID=...
DEVELOPMENT_AUTH0_CLIENT_SECRET=...
```

Replacing `DEVELOPMENT` with `PRODUCTION` if necessary.

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
