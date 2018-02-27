# Changelog

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

#### UI/UX

- Form now submits when you press `ENTER` in the password field.
- We now catch failed requests when checking for LDAP/non-LDAP and available login
  methods. This can happen for example if one's internet connection fails or if
  one of the API endpoints is down. In both cases we revert back to first page of NLX.
- It is now possible to have users go to the non-LDAP screen even if their email is an
  LDAP account. RPs can utilise this by adding `forceNonLDAP=true` to the URL.

#### Build process

- Some features are now optional at point of building a version of NLX: Person API
  lookup and autologin. This allows us to create a release without those features.
- Settings that depend on the environment NLX runs in, such as the Auth0 URL, are
  now abstracted out of the NLX code and set in configuration files that are injected
  in the code as part of the build process.

### Changed

#### UI/UX

- Card now has margins around it on mobile.
- We now show a spinner when performing an autologin, as well as a text that shows
  what login method we are autologging in with.
- We no longer show the words “or third parties” if neither GitHub or Google are
  available as login methods. The text then simply becomes “Login with email”
- Buttons no longer have platform UI styling (i.e. a gradient on iOS)
- Autologin redirect no longer causes NLX to be added to a user's browser history.
  This means that the back button no longer takes people back to NLX if they
  have been autologged in (this is helpful, because for most RPs, going back to
  NLX will result in errors).

### Removed

- Hardcoded URLs have been removed.

## [1.1.0] - 2017-02-27

_Will likely contain unreleased changes._

## [1.0] - 2017-02-21

The first release of NLX to the public.
