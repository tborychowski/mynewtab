/*global chrome */
window.onload = function () {
	'use strict';
	var
		form = null,
		statusBox = null,
		options = { url: '', lastUpdate: null };
	form = document.getElementById('optionsForm');
	statusBox = document.getElementById('status');

	chrome.storage.local.get(null, function (cfg) {
		options.url = cfg.url || '';
		form.url.value = options.url;
	});

	form.onsubmit = function () {
		options.url = form.url.value;
		chrome.storage.local.set(options);
		statusBox.innerHTML = 'Options saved successfully.';
		return false;
	};
};
