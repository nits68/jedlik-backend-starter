import App from "./app";
import nsideController from "./controllers/nside.controller";
import onesideController from "./controllers/oneside.controller";

const app = new App([new nsideController(), new onesideController()]);

app.listen();
