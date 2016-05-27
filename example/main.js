require('../src');
require('./demo');

if (module.hot) {
  module.hot.accept('./demo', function _() {
    require('./demo');
    console.log('reload');
  });

  module.hot.accept('../src', function _() {
    window.location.reload();
  });
}