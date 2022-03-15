import App from "./app";
import recipeController from "./controllers/recipe.controller";

const app = new App([new recipeController()]);

app.listen();
