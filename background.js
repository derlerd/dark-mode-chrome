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

// Handler for install event. Turns off dark mode and updates all tabs.
function handle_install() {
  update_action_text(false);
  update_tabs();
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

// Iterates over all tabs and calls `execute_inversion` with the appropriate 
// parameters.
function update_tabs() {
  chrome.tabs.query({"windowType": "normal"}, function(tabs) {
    tabs.forEach(function(tab) {
      execute_inversion(tab.id, tab.url);
    });
  });
}

// Helper function that calls the `invert` function on the page referenced
// by tabId, passing `url` as a parameter. If the url starts with `chrome://`
// or is empty it does nothing.
function execute_inversion(tabId, url) {
  if(url.startsWith("chrome://") || url == "") {
    return;
  }
  chrome.tabs.executeScript(tabId, {"code" : "invert();" });
}

// Helper function that updates the badge on the action icon and 
// sets the persisted status according to `active`.
function update_action_text(active) {
  if(active) {
    chrome.browserAction.setBadgeText({"text": "ON"});
  } else {
    chrome.browserAction.setBadgeText({});
  }
  chrome.storage.sync.set({"active": active});
}


