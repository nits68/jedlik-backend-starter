import App from "./app";
// remove onesideController or nsideController, if you don't use it:
import nsideController from "./controllers/nside.controller";
import onesideController from "./controllers/oneside.controller";

new App([new nsideController(), new onesideController()]);
