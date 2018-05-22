# Changelog

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [1.3.0]

### Added

- Added auto-login switch
- Added hidden auto-login settings screen
- Tooltip component that explains auto-login switch

### Changed

- Labels moved to be placed on top of input, float above input when text entered / focused

### Removed

- ‘Or login with’ text; each button now says ‘Login with’

## [1.2.1]

### Added

- Added `URLSearchParams` polyfill

### Changed

- Use `URLSearchParams` to contruct the redirect URL (more reliable)
- Remove `prompt` if not set, so that OIDC OP that do not support it don't get confused
- Tweak padding in small screen view so that it is like it was before

## [1.2.0]

### Added

- Firefox Accounts support, pref'd off for production, see also
  [POC](https://github.com/mozilla-iam/mozilla-iam/issues/36)
- We can now trigger a logout from NLX, the first use case is the logout in SSO Dashboard.

### Changed

- Updated wording in various places to make things clearer:
-- We now say 'Log in with email' and if there are social options 'Or log in with'
-- Social buttons now just say the name of the option (and have visually hidden
   text that adds 'Log in with' for users of assistive technologies)
-- We now say ‘Please enter your LDAP password’ to make it clearer for users who
   may not realise their email address is actually a valid LDAP address
- We now convert email addresses to lowercase before checking or submitting
- Google and GitHub logos no longer have 1px line at top missing
- The page is now layed out with CSS Grid Layout, so that banners can take up
  the space they need, while the card centers in the remaining space.
- Links at bottom of card have now CSS with more prefixes, so that they work in
  older versions of Webkit and Internet Explorer (as those sometimes get used).

## [1.1.4] - 2018-03-26

### Added

- Add polyfill for localStorage so that NLX works in browsers that don't support it
  (including Android Webviews)

## [1.1.3] - 2018-03-22

- Remove `prompt` support for autologin as it gets forwarded to Social providers in some cases, which may fail the entire login process.

## [1.1.2] - 2018-03-21

### Changed

- Uses Auth0js v9.3.3

## [1.1.1] - 2018-03-15

### Added

- We now show an error message when LDAP is not available as a login method.
- We now show an error message when LDAP is required and it is the only login method the RP supports.
- Added link to this changelog to HTML source code.

### Changed

- We started honouring the `prompt` parameter as per OIDC spec in these ways: if value is `select_account` and `login`, autologin will not be attempted.
- External links now open in a new window/tab.
- When account linking, we no longer save the login method you're linking as your next autologin login method.
- After account linking, NLX will prompt you to manually login, as we're unable to guess your ideal login method.
- Improved loading spinner performance.
- Fixed malformed SVGs.
- Improved content hiding mechanism, so that it also hides from assistive technologies.
- We now only log to Google Analytics when in PROD, if elsewhere, we log to the console.


## [1.1.0] - 2018-02-27

### Added

#### UI/UX

- Form now submits when you press `ENTER` in the password field.
- We now catch failed requests when checking for LDAP/non-LDAP and available login
  methods. This can happen for example if one's internet connection fails or if
  one of the API endpoints is down. In both cases we revert back to first page of NLX.
- The screen can now be loaded with the ‘acccount linking’ parameter, which will
  skip autologin and skip the shortcut for `mozilla.com|mozillafoundation.org|getpocket.com`
  email addresses.

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

## [1.0] - 2017-02-21

The first release of NLX to the public.

