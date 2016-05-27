
// This file is forked from Webpack, maybe older version, 1.13.x?
// https://github.com/webpack/webpack-dev-server/blob/v1.14.1/client/live.js
var docReady = require('doc-ready');
var url = require('url');
var SockJS = require("sockjs-client");
var stripAnsi = require('strip-ansi');
var renderTip = require('bottom-tip').render;

var scriptElements = document.getElementsByTagName("script");
var scriptHost = scriptElements[scriptElements.length-1].getAttribute("src").replace(/\/[^\/]+$/, "");

// If this bundle is inlined, use the resource query to get the correct url.
// Else, get the url from the <script> this file was called with.
var urlParts = url.parse(typeof __resourceQuery === "string" && __resourceQuery ?
	__resourceQuery.substr(1) :
	(scriptHost ? scriptHost : "/")
);

var sock = null;
var hot = false;
var initial = true;
var currentHash = "";

var timeoutRef;
var tipElement = document.createElement('div');
function display(hudType, hudMessage) {
    if (hudType == 'ok') {
        timeoutRef = setTimeout(function() {
            renderTip(tipElement, 'inactive', '');
        }, 2000);
    } else {
        renderTip(tipElement, hudType, hudMessage);
        clearTimeout(timeoutRef);
    }
};

docReady(function() {
    document.body.appendChild(tipElement);
});

var onSocketMsg = {
	hot: function() {
		hot = true;
		// console.log("[WDS] Hot Module Replacement enabled.");
	},
	invalid: function() {
		// console.log("[WDS] App updated. Recompiling...");
	},
	hash: function(hash) {
		currentHash = hash;
	},
	"still-ok": function() {
		// console.log("[WDS] Nothing changed.")
        display('ok', 'OK');
	},
	ok: function() {
        display('ok', 'OK');
		if(initial) return initial = false;
	},
	warnings: function(warnings) {
		// console.log("[WDS] Warnings while compiling.");
        var warningMsg = warnings.map(function(warning) {
            return stripAnsi(warning);
        }).join('\n');
        display('warn', warningMsg);
		if(initial) return initial = false;
	},
	errors: function(errors) {
		// console.log("[WDS] Errors while compiling.");
        var errorMsg = errors.map(function(error) {
            return stripAnsi(error);
        }).join('\n');
        display('error', errorMsg);
		if(initial) return initial = false;
	},
	"proxy-error": function(errors) {
		// console.log("[WDS] Proxy error.");
		if(initial) return initial = false;
	}
};

var newConnection = function() {
	sock = new SockJS(url.format({
		protocol: urlParts.protocol,
		auth: urlParts.auth,
		hostname: (urlParts.hostname === '0.0.0.0') ? window.location.hostname : urlParts.hostname,
		port: urlParts.port,
		pathname: urlParts.path === '/' ? "/sockjs-node" : urlParts.path
	}));

	sock.onclose = function() {
		// Try to reconnect.
		sock = null;
		setTimeout(function () {
			newConnection();
		}, 2000);
	};

	sock.onmessage = function(e) {
		// This assumes that all data sent via the websocket is JSON.
		var msg = JSON.parse(e.data);
		onSocketMsg[msg.type](msg.data);
	};
};

newConnection();
