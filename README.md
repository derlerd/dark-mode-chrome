# Chrome Dark Mode

A Chrome extension providing a dark mode. Clicking the extension icon will switch between dark and light mode. When dark mode is switched on, a `style` element containing 
```css
img, html { 
  -webkit-filter: invert(90%); 
}
```
is injected into all currently open tabs. It is removed again when dark mode is switched off. New tabs will automatically use the currently active mode. 

We intentionally do not use sophisticated dark-mode libraries and try to keep things very simple in general. This is because an extension implementing such functionality requires extensive permissions and we want to make it as easy as possible to verify that it does what it is expected to do.

## Blacklisting Pages

To prevent the extension from touching certain pages, they can be added to `blacklist.js`. Before injecting a style element into a page, the extension will check whether there is an item on the blacklist that is a prefix of the current page's url. We currently do not support dynamic adaptation of the blacklist by the user for simplicity reasons. 