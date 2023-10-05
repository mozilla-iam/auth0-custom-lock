module.exports = function mozillaAccountsPost ( element ) {
  var banner = document.getElementById("accounts-banner-post");
  banner.style.display = "none";
  window.localStorage.setItem('mozilla-accounts-banner-post', 1)
};
