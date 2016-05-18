
require('./demo')
require('./hud')

if (module.hot) {
  module.hot.accept('./demo', function() {
    require('./demo')
    console.log('reload')
  })
  
  module.hot.accept('./hud', function() {
    location.reload();
  })
}