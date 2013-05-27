(function () {
	'use strict';
	/*global chrome */
	var
	form = null,
	statusBox = null,
	options = { url: '', lastUpdate: null },

	$ = function (id) { return document.getElementById(id); },

	_save = function () {
		var url = form.url.value;
		options.url = url;
		chrome.storage.local.set(options);
		statusBox.innerHTML = 'Options saved successfully.';
		return false;
	};

	window.onload = function () {
		form = $('optionsForm');
		statusBox = $('status');

		chrome.storage.local.get(null, function (cfg) {
			if (cfg && cfg.url) options.url = cfg.url;
			form.url.value = options.url;
		});


		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function () {
			var html = '';
			if (xhr.readyState === 4 && xhr.status === 200) {
				html = xhr.responseText.replace(/<script.*?>.*?<\/script>/ig, '');
				html = html.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/'/g, '&quot;');
				html = html.replace(/url\(data\:image.*\)/g, 'url(_PATH_TO_IMAGE)');

				$('sampleContainer').innerHTML = html;
			}
		};
		xhr.open('GET', 'default.html', true);
		xhr.send();

		// $.get('default.html').done(_replaceSample);

		form.onsubmit = _save;
	};

}(this));