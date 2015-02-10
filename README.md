mynewtab
========
Google Chrome New Tab Page replacer.
Replace your new tab with any url keeping the address bar clean!

###Requirements
The html page is injected to an iframe, so there is one requirement: the line below must be placed in `<head>` of the injected page:
```html
<base target="_parent" />
```
This will make the links to open in the top frame and everything should work great!

###Install
From [Chrome Store](https://chrome.google.com/webstore/detail/my-new-tab/mnecfcpcjodmnejjbonbbcoggjincejc)