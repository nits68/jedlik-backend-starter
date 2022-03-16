import App from "./app";
import nsideController from "./controllers/nside.controller";

const app = new App([new nsideController()]);

app.listen();
