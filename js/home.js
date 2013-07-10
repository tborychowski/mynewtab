/*global chrome */
(function ($) {
	'use strict';

	var
	_currentTab = null,
	_apps = null,
	_appsContainer = null,
	_linksContainer = null,
	_config = { html: null },

	/*** HANDLERS *****************************************************************************************************/
	_timeToDate = function (ts) {
		var d = new Date(ts), dat = d.toDateString(), tim = d.toTimeString(), dd = [];
		dd.push(dat.substring(0, dat.length - 5));
		dd.push(tim.substr(0, 5));
		return '&nbsp;&nbsp;&nbsp;' + dd.join(', ') + '';
	},
	_hideBottomPane = function () { _apps.removeClass('expanded'); },
	_showBottomPane = function (e) { _apps.toggleClass('expanded'); e.stopPropagation(); },
	_openTab = function (e) {
		e.preventDefault();
		chrome.tabs.create({ url: this.href, index: _currentTab.index + 1 });
	},
	_launchChromeApp = function () {
		var app = $(this), id = app.data('id');
		chrome.management.launchApp(id);
	},

	_onResize = function () {
		_appsContainer.width('auto');
		var containerW = _appsContainer.innerWidth(),
			appW = _appsContainer.find('.app').first().outerWidth(true) + 4,
			newW = Math.floor(containerW / appW) * appW;
		_appsContainer.width(newW);
		
		
		var sections = _linksContainer.find('.link-section'), len = sections.length, w = Math.floor(100 / len);
		while (len--) sections[len].style.width = w + '%';
	},
	/*** HANDLERS *****************************************************************************************************/



	/*** HTML *********************************************************************************************************/
	_getBottomBar = function () {
		return '<div class="chrome-apps"></div>' +
			'<div class="bottom-bar">' +
			'<a class="lnk" href="#" id="lnkHistory">Recent History</a>' +
			'<a class="lnk page-lnk" href="chrome://extensions" id="lnkExtensions">Extensions</a>' +
			'<a class="lnk page-lnk" href="chrome://downloads" id="lnkDownloads">Downloads</a>' +
			'<a class="btn page-lnk" href="settings.html" id="btnSettings"></a>' +
			'</div>';
	},

	_getBottomPaneHtml = function () {
		return '<div class="bottom-pane"><div id="recents"></div>' +
			'<a href="chrome://history" class="page-lnk" id="historyLink">more...</a></div>';
	},

	_getHistoryItemHtml = function (item) {
		var dat = '';
		if (item.lastVisitTime) dat = _timeToDate(item.lastVisitTime);
		if (!item.title.length) item.title = item.url.substr(0, item.url.indexOf('/', 10));
		return '<a class="list-item" href="' + item.url + '" style="background-image: url(chrome://favicon/' +
			item.url + ')">' + item.title + dat + '</a>';
	},

	_getChromeAppHtml = function (item) {
		if (!item.isApp) return '';
		return '<a class="chrome-app" title="' + item.name + '" href="#' + item.name + '" data-id="' + item.id + '"' +
			' style="background-image: url(' + item.icons[item.icons.length - 1].url + ')"></a>';
	},

	_replaceHtml = function (html) {
		if (!html || !html.length) return;
		html = html.replace(/<script.*?>.*?<\/script>/ig, '').replace('<html>', '').replace('</html>', '');
		_config.html = html;
		chrome.storage.local.set(_config);
		$('html').html(html);
		$('html style').after('<link rel="stylesheet" href="css/home-ext.css">');
		_reInit();
	},
	/*** HTML *********************************************************************************************************/




	/*** INIT *********************************************************************************************************/
	_initRecentHistory = function (data) {
		var html = [];
		data.forEach(function (el) { html.push(_getHistoryItemHtml(el)); });
		$('#recents').html(html.join(''));
		$(window).on('resize', _onResize);
	},

	_initChromeApps = function (data) {
		var html = [];
		data.forEach(function (el) { html.push(_getChromeAppHtml(el)); });
		$('.chrome-apps').html(html.join(''));
	},

	_initEvents = function () {
		_apps.off('.pagelnk')
			.on('click.pagelnk', _hideBottomPane)
			.on('click.pagelnk', '#lnkHistory', _showBottomPane)
			.on('click.pagelnk', '.chrome-app', _launchChromeApp);

		$('html').off('.pagelnk').on('click.pagelnk', '.page-lnk', _openTab);
	},

	_reInit = function () {
		_apps = $('#apps');
		_appsContainer = $('#appsContainer');
		_linksContainer = $('#linksContainer');

		$('.bottom-pane, .bottom-bar').remove();
		_apps.append(_getBottomBar()).after(_getBottomPaneHtml());

		chrome.history.search({ text: '', maxResults: 10, endTime: +(new Date()) }, _initRecentHistory);
		chrome.management.getAll(_initChromeApps);

		_initEvents();
		_onResize();
	};
	/*** INIT *********************************************************************************************************/



	window.onload = function () {
		chrome.tabs.getCurrent(function (tab) { _currentTab = tab; });
		chrome.storage.local.get(null, function (cfg) {
			if (cfg && Object.keys(cfg).length) {
				_config = $.extend(_config, cfg);
				_replaceHtml(cfg.html);
			}
			else chrome.tabs.create({ url: 'settings.html', index: _currentTab.index + 1 });

			// retrieve from the server and replace local
			$.get(_config.url || 'default.html').done(_replaceHtml);
		});
	};


}(jQuery));