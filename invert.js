invert();

// Checks whether the page is on the black list. If not, it sets 
// the mode depending on the `active` variable.
function invert() {
  // Inject the style for dark mode or removes it depending on `dark`
  const set_mode = function(dark) {
    let tag_id = 'dark-mode-' + chrome.runtime.id;

    let old = document.getElementById(tag_id);
    if(old !== null && old.localName === "style") {
      old.remove();
    } 

    if(dark) {
      let css = 'img, html { -webkit-filter: invert(); }';

      let style = document.createElement('style');
      style.type = 'text/css';
      style.id = tag_id;
      style.appendChild(document.createTextNode(css));

      document.head.appendChild(style);
    }
  }

  // Checks whether the given page is on the black list.
  const is_blacklisted = function(page) {
    for (const item of dark_mode_blacklist) {
      if(page.startsWith(item)) {
        return true;
      }
    }
    return false;
  }

  if(is_blacklisted(window.location.toString())) {
    return;
  }

  chrome.storage.sync.get('active', function(data) {
    set_mode(data.active);
  });
}




