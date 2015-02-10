/*global chrome */
(function () {
	'use strict';
	var form = null,
		statusBox = null,
		currentTab = null,
		options = { url: '', lastUpdate: null },
		submit = function () {
			options.url = form.url.value;
			chrome.storage.sync.set(options);
			statusBox.innerHTML = 'Options saved successfully.';
			if (currentTab) chrome.tabs.update(currentTab.id, { url: 'chrome://newtab' });
			return false;
		};

	window.onload = function () {
		form = document.getElementById('optionsForm');
		statusBox = document.getElementById('status');

		chrome.storage.sync.get(null, function (cfg) {
			options.url = cfg.url || '';
			form.url.value = options.url;
		});
		chrome.tabs.getCurrent(function (tab) { currentTab = tab; });
		form.onsubmit = submit;
	};
}());