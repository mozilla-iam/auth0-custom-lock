module.exports = function headerBannerPre ( element ) {
  var banner = document.getElementById("header-banner-pre");
  banner.style.display = "none";
  window.localStorage.setItem('header-banner-pre', 1)
};
