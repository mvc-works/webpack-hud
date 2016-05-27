'use strict';

var _docReady = require('doc-ready');

var _docReady2 = _interopRequireDefault(_docReady);

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

var _sockjsClient = require('sockjs-client');

var _sockjsClient2 = _interopRequireDefault(_sockjsClient);

var _stripAnsi = require('strip-ansi');

var _stripAnsi2 = _interopRequireDefault(_stripAnsi);

var _bottomTip = require('bottom-tip');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var tipElement = document.createElement('div'); // This file is forked from Webpack, maybe older version, 1.13.x?
// https://github.com/webpack/webpack-dev-server/blob/v1.14.1/client/live.js

(0, _docReady2.default)(function () {
  document.body.appendChild(tipElement);
});

var timeoutRef = void 0;
function display(hudType, hudMessage) {
  if (hudType === 'ok') {
    timeoutRef = setTimeout(function () {
      (0, _bottomTip.render)(tipElement, 'inactive', '');
    }, 2000);
  } else {
    (0, _bottomTip.render)(tipElement, hudType, hudMessage);
    clearTimeout(timeoutRef);
  }
}

var initial = true;
var onSocketMsg = {
  'still-ok': function stillOk() {
    display('ok', 'OK');
  },
  ok: function ok() {
    display('ok', 'OK');
    if (initial) {
      initial = false;
    }
  },
  warnings: function warnings(_warnings) {
    var warningMsg = _warnings.map(function (s) {
      return (0, _stripAnsi2.default)(s);
    }).join('\n');
    display('warn', warningMsg);
    if (initial) {
      initial = false;
    }
  },
  errors: function errors(_errors) {
    var errorMsg = _errors.map(function (s) {
      return (0, _stripAnsi2.default)(s);
    }).join('\n');
    display('error', errorMsg);
    if (initial) {
      initial = false;
    }
  },
  'proxy-error': function proxyError() {
    if (initial) {
      initial = false;
    }
  }
};

// If this bundle is inlined, use the resource query to get the correct url.
// Else, get the url from the <script> this file was called with.
var urlParts = function () {
  var scriptElements = document.getElementsByTagName('script');
  var scriptHost = scriptElements[scriptElements.length - 1].getAttribute('src').replace(/\/[^\/]+$/, '');

  /* global __resourceQuery */
  return _url2.default.parse(typeof __resourceQuery === 'string' && __resourceQuery ? __resourceQuery.substr(1) : scriptHost || '/');
}();

var sock = void 0;
(function connect() {
  sock = new _sockjsClient2.default(_url2.default.format({
    protocol: urlParts.protocol,
    auth: urlParts.auth,
    hostname: urlParts.hostname === '0.0.0.0' ? window.location.hostname : urlParts.hostname,
    port: urlParts.port,
    pathname: urlParts.path === '/' ? '/sockjs-node' : urlParts.path
  }));

  sock.onclose = function () {
    // Try to reconnect.
    sock = null;
    setTimeout(function () {
      connect();
    }, 2000);
  };

  sock.onmessage = function (e) {
    // This assumes that all data sent via the websocket is JSON.

    var _JSON$parse = JSON.parse(e.data);

    var type = _JSON$parse.type;
    var data = _JSON$parse.data;

    if (onSocketMsg.hasOwnProperty(type)) {
      onSocketMsg[type](data);
    }
  };
})();