// This file is forked from Webpack, maybe older version, 1.13.x?
// https://github.com/webpack/webpack-dev-server/blob/v1.14.1/client/live.js
import docReady from 'doc-ready';
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
    }, 1000);
  } else {
    renderTip(tipElement, hudType, hudMessage);
    clearTimeout(timeoutRef);
  }
}

function handleMessage(msg) {
  if (!msg.data || !msg.data.type) {
    return;
  }
  let webpackMsg = msg.data;
  
  switch (webpackMsg.type) {
  case 'webpackOk':
    display('ok', 'OK');
    break;
  case 'webpackStillOK':
    display('ok', 'StillOk');
    break;
  case 'webpackInvalid':
    // console.log('compiling...');
    break;
  case 'webpackWarnings':
    const warningMsg = webpackMsg.data.map((s) => stripAnsi(s)).join('\n');
    display('warn', warningMsg);
    break;
  case 'webpackErrors':
    const errorMsg = webpackMsg.data.map((s) => stripAnsi(s)).join('\n');
    display('warn', errorMsg);
    break;
  case 'webpackClose':
    display('warn', 'Invalid');
    break;
  default:
    console.warn('Unrecognized message:', webpackMsg);
  }
};

window.addEventListener('message', handleMessage, false);
