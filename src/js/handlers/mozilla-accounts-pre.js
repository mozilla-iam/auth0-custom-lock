module.exports = function mozillaAccountsPre( element ) {
  var banner = document.getElementById("accounts-banner-pre");
  banner.style.display = "none";
  window.localStorage.setItem('mozilla-accounts-banner-pre', 1)
};
