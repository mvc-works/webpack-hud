// This file is forked from Webpack, maybe older version, 1.13.x?
// https://github.com/webpack/webpack-dev-server/blob/v1.14.1/client/live.js
import docReady from 'doc-ready';
import url from 'url';
import SockJS from 'sockjs-client';
import stripAnsi from 'strip-ansi';
import { renderTip } from 'bottom-tip';

const tipElement = document.createElement('div');
docReady(() => {
  document.body.appendChild(tipElement);
});

let timeoutRef;
function display(hudType, hudMessage) {
  if (hudType === 'ok') {
    renderTip(tipElement, 'ok', 'OK');
    timeoutRef = setTimeout(() => {
      renderTip(tipElement, 'inactive', '');
    }, 2000);
  } else {
    renderTip(tipElement, hudType, hudMessage);
    clearTimeout(timeoutRef);
  }
}

let initial = true;
const onSocketMsg = {
  'still-ok'() {
    display('ok', 'OK');
  },
  ok() {
    display('ok', 'OK');
    if (initial) {
      initial = false;
    }
  },
  warnings(warnings) {
    const warningMsg = warnings.map((s) => stripAnsi(s)).join('\n');
    display('warn', warningMsg);
    if (initial) {
      initial = false;
    }
  },
  errors(errors) {
    const errorMsg = errors.map((s) => stripAnsi(s)).join('\n');
    display('error', errorMsg);
    if (initial) {
      initial = false;
    }
  },
  'proxy-error'() {
    if (initial) {
      initial = false;
    }
  }
};

// If this bundle is inlined, use the resource query to get the correct url.
// Else, get the url from the <script> this file was called with.
const urlParts = (() => {
  const scriptElements = document.getElementsByTagName('script');
  const scriptHost = scriptElements[scriptElements.length - 1].getAttribute('src').replace(/\/[^\/]+$/, '');

  /* global __resourceQuery */
  return url.parse(typeof __resourceQuery === 'string' && __resourceQuery ?
    __resourceQuery.substr(1) :
    (scriptHost || '/')
  );
})();

let sock;
(function connect() {
  sock = new SockJS(url.format({
    protocol: urlParts.protocol,
    auth: urlParts.auth,
    hostname: (urlParts.hostname === '0.0.0.0') ? window.location.hostname : urlParts.hostname,
    port: urlParts.port,
    pathname: urlParts.path === '/' ? '/sockjs-node' : urlParts.path
  }));

  sock.onclose = () => {
    // Try to reconnect.
    sock = null;
    setTimeout(() => {
      connect();
    }, 2000);
  };

  sock.onmessage = (e) => {
    // This assumes that all data sent via the websocket is JSON.
    const { type, data } = JSON.parse(e.data);
    if (onSocketMsg.hasOwnProperty(type)) {
      onSocketMsg[type](data);
    }
  };
}());
