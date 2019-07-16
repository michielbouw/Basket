function openMenu() {
  var openIcon = document.getElementById('menu-open-icon');
  openIcon.style.display = 'none';
  openIcon.tabIndex = '-1';
  var closeIcon = document.getElementById('menu-close-icon');
  closeIcon.style.display = 'inline';
  closeIcon.tabIndex = '0';

  var template =
    '<div class="menu-overlay">' +
      '<div class="container menu-content">' +
        '<h2>Menu</h2>' +
        '<ul>' +
          '<li tabindex="0"><a>My Baskets</a></li>' +
        '</ul>' +
        '<ul class="menu-bottom">' +
          '<li tabindex="0"><a aria-label="View your profile"><img class="user-logo" src="./assets/user.png" />&nbsp;&nbsp;<b>Sam</b></a></li>' +
          '<li tabindex="0"><a aria-label="Setup your Basket and share with friends">Settings</a></li>' +
          '<li tabindex="0"><a aria-label="More information about Basket">Help</a></li>' +
          '<li tabindex="0"><a>Sign out</a></li>' +
        '</ul>' +
      '</div>' +
      '<footer>' +
        '<div class="container">' +
          '<div class="footer-content">' +
            '<img src="./assets/logo.png" />' +
            'Basket | 2019 &copy; Michiel Bouw' +
          '</div>' +
        '</div>' +
      '</footer>' +
    '</div>';
  var overlayWrapper = document.getElementById('overlay-wrapper');
  overlayWrapper.innerHTML = template;

  // focus on first nav item
  document.querySelector('.menu-content li').focus();

  var body = document.querySelector('body');
  body.style.overflow = 'hidden';
}

function closeMenu() {
  var openIcon = document.getElementById('menu-open-icon');
  openIcon.style.display = 'inline';
  openIcon.tabIndex = '0';
  var closeIcon = document.getElementById('menu-close-icon');
  closeIcon.style.display = 'none';
  closeIcon.tabIndex = '-1';

  var overlayWrapper = document.getElementById('overlay-wrapper');
  overlayWrapper.innerHTML = '';

  var body = document.querySelector('body');
  body.style.overflow = '';
}
