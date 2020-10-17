// Register for install event
chrome.runtime.onInstalled.addListener(handle_install);

// Register for startup event
chrome.runtime.onStartup.addListener(function() {
  chrome.storage.sync.get('active', handle_startup);
});

// Register for click events
chrome.browserAction.onClicked.addListener(function() {
  chrome.storage.sync.get('active', handle_click);
});

// Handler for install event.
function handle_install() {
  update_action_text(false);
  
  // Content scripts are not injected in existing tabs. To this 
  // end we manually inject them in the existing tabs.
  reload_content_script();
}

// Iterates over all currently open tabs and re-injects the content
// scripts. 
function reload_content_script() {
  chrome.tabs.query({"windowType": "normal"}, function(tabs) {
    tabs.forEach(function(tab) {
      execute(tab.id, tab.url, {"file": "./blacklist.js"});
      execute(tab.id, tab.url, {"file": "./invert.js"});
    });
  });
}

// Handler for startup event. Updates the action text according to 
// `data.active`.
function handle_startup(data) {
  update_action_text(data.active);
}

// Handler for clicks on the browser action. Toggles light/dark mode relative 
// to `data.active` and updates all tabs.
function handle_click(data) {
  update_action_text(!data.active);
  update_tabs();
}

// Iterates over all tabs and executes `invert();` on them.
function update_tabs() {
  chrome.tabs.query({"windowType": "normal"}, function(tabs) {
    tabs.forEach(function(tab) {
      execute(tab.id, tab.url, {"code": "invert();"});
    });
  });
}

// Executes the `script` relative to `tabId` and `url`. 
function execute(tabId, url, script) {
  if(url.startsWith("chrome://") || url == "") {
    return;
  }
  chrome.tabs.executeScript(tabId, script);
}

// Updates the badge on the action icon and sets the persisted status according 
// to `active`.
function update_action_text(active) {
  if(active) {
    chrome.browserAction.setBadgeText({"text": "ON"});
  } else {
    chrome.browserAction.setBadgeText({});
  }
  chrome.storage.sync.set({"active": active});
}


