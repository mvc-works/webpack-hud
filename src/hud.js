
// This file is forked from Webpack, maybe older version, 1.13.x?
// https://github.com/webpack/webpack-dev-server/blob/v1.14.1/client/live.js

var url = require('url');
var SockJS = require("sockjs-client");
var stripAnsi = require('strip-ansi');

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

var display;
var timeoutRef;
var hudPanel;

(function(){
    hudPanel = document.createElement('div');
    hudPanel.className = 'hud-panel is-inactive';
    var styleEl = document.createElement('style');
    styleEl.innerHTML = `
    .hud-panel {
        position: fixed;
        bottom: 0px;
        left: 0;
        width: 100%;
        padding: 16px;
        font-size: 12px;
        line-height: 1.5;
        max-height: 0%;
        overflow: auto;
        font-family: Source Code Pro, Menlo, Consolas, monospace;
        white-space: pre;
        transition-duration: 300ms;
        opacity: 1;
        color: black;
    }
    .hud-panel.is-inactive {
        overflow: hidden;
        opacity: 0;
        max-height:0%;
    }
    .hud-panel.is-error {
        background-color: hsla(0, 100%, 75%, 0.92);
        max-height: 100%;
    }
    .hud-panel.is-warning {
        background-color: hsla(50, 100%, 70%, 0.84);
        max-height: 80%;
    }
    .hud-panel.is-ok {
        background-color: hsla(120, 49%, 60%, 0.28);
        max-height: 10%;
    }
    `;
    var msgEl = document.createElement('div');
    hudPanel.appendChild(styleEl);
    hudPanel.appendChild(msgEl);
    
    display = function(hudType, hudMessage) {
        msgEl.innerText = hudMessage;
        hudPanel.className = `hud-panel is-${hudType}`;
        if (hudType == 'ok') {
            timeoutRef = setTimeout(function() {
               display('inactive', '');
            }, 2000);
        } else {
            clearTimeout(timeoutRef);
        }
    };

})();

window.addEventListener('load', function() {
    document.body.appendChild(hudPanel);
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
        display('warning', warningMsg);
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
