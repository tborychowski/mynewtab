/*global chrome */
(function () {
	'use strict';

	// function fetch (url, cb, err) {
	// 	var req = new XMLHttpRequest();
	// 	req.open('GET', url, true);
	// 	req.onload = function () {
	// 		if (req.status >= 200 && req.status < 400) cb(true, req.responseText);
	// 		else err(req.statusText);
	// 	};
	// 	req.onerror = function () { err(req.statusText); };
	// 	req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	// 	req.send();
	// }

	// // retrieve from the server and replace local
	// function replaceHtml (err, html) {
	// 	if (err || !html) return;
	// 	html = html.replace('<html>', '').replace('</html>', '');
	// 	document.body.parentNode.innerHTML = html;
	// }

	window.onload = function () {
		var currentTab = null, frame = document.getElementById('frame');
		chrome.tabs.getCurrent(function (tab) { currentTab = tab; });
		chrome.storage.local.get(null, function (cfg) {
			// if (cfg && cfg.url) fetch(cfg.url, replaceHtml);
			if (cfg && cfg.url) frame.src = cfg.url;
			else chrome.tabs.create({ url: 'settings.html', index: currentTab.index + 1 });
		});
	};


}());
