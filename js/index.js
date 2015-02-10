/*global chrome */
(function () {
	'use strict';

	var currentTab = null, frame;

	window.onload = function () {
		frame = document.getElementById('frame');
		chrome.tabs.getCurrent(function (tab) { currentTab = tab; });
		chrome.storage.sync.get(null, function (cfg) {
			if (cfg && cfg.url) {
				if (cfg.url.indexOf('http://') === -1) cfg.url = 'http://' + cfg.url;
				frame.src = cfg.url;
			}
			else chrome.tabs.update(currentTab.id, { url: 'settings.html' });
			// else chrome.tabs.update(currentTab.id, {
			// 	url: 'chrome://extensions?options=elpfnnikelmconknijbingfejndjlnof'
			// });
		});
	};


}());
