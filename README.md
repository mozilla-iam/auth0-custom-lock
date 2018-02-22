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
