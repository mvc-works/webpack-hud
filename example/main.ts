import "../src";
import "./demo";

declare let module: any;

if (module.hot) {
  module.hot.accept("./demo", function _() {
    console.log("reload");
  });

  module.hot.accept("../src", function _() {
    window.location.reload();
  });
}
