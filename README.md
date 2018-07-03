# Auth0 Custom Lock

[![Build Status](https://travis-ci.org/mozilla-iam/auth0-custom-lock.svg?branch=master)](https://travis-ci.org/mozilla-iam/auth0-custom-lock)

## Build tools

This project uses Gulp to run a number of automated tasks, including one that grabs our source files (HTML, Sass, JS) and compiles them into one single HTML file that has everything inlined and can be deployed to auth0.

When the project was built succesfully, you should get a `dist` folder, with the generated HTML.

### Installation

To install all resources for this project, please make sure to have [Node](https://nodejs.org/) installed, then run:

```bash
npm install
```

### Building the page

If you want to build the page just once, for example to deploy it, run:

```bash
npm run build
```

> Note: in order to build the production configuration you should run `export NODE_ENV=production` otherwise this will default to the dev environment.

### Viewing/developing locally

To view (and develop) locally, this project has a server built in. To compile the sources and serve them, run:

```bash
npm start
```

This should start a local server and open it in the browser. It also starts a watch task. If you make any changes in source files (HTML, Sass or JS), the `dist` folder will get rebuilt.

## Coding standards

This project contains config files for the editor, ESLint and SCSS-Lint.

## Environment variables

Throughout the project, we have some variables that are environment specific, for example the URL that Auth0 connects to. They are set in the `config` folder, following `environment-name.json` as a naming pattern.

We can then use them anywhere in the codebase, as `index.html` is ran through Mustache, which will replace the variables with the values the environment needs.

### Using the variables in JavaScript

All variables are assigned to the global `NLX` object in main.js and are be used throughout the JavaScript as `NLX.variable`.

### Boolean variables

Because only in strings the Mustache syntax can produce valid JavaScript, we save booleans as strings (`'true'` and `'false'`). They can then easily be turned into booleans:

```js
NLX.variable === 'true' // true or false
```

## Parameters for special screens

When you call NLX with one of the following parameters, the standard interactive screen is not shown, instead you will get a special screen.

### action=autologin_settings

Auto-login Settings screen. Allows user to enable or disable auto-login.

### action=error_githubrequiremfa

Error message for when GitHub is used without MFA.

### action=error_fxarequiremfa

Error message for when Firefox Accounts is used without MFA.

### action=error_notingroup

Error message for when user does not have correct group permissions.

### action=error_accesshasexpired

Error message for when access has expired.

### action=error_primarynotverified

Error message for when primary identity was not verified.

### action=error_incorrectaccount

Error message for when wrong account is being used to log in.

### action=error_general

General error message.
