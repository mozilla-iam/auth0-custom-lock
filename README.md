# Auth0 Custom Lock

[![Build Status](https://travis-ci.org/mozilla-iam/auth0-custom-lock.svg?branch=master)](https://travis-ci.org/mozilla-iam/auth0-custom-lock)

## Build tools

This project uses Gulp to run a number of automated tasks, including one that grabs our source files (HTML, Sass, JS)
and compiles them into one single HTML file that has everything inlined and can be deployed to auth0. 

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

For development:
```bash
./dmake deploy
```

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
