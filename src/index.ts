import "reflect-metadata";
import { Container } from "inversify";
import { InversifyExpressServer } from "inversify-express-utils";

// import logger from "jet-logger";
import * as express from "express";
import * as bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import { bindings } from "./inversify.config";
import swaggerUi from "swagger-ui-express";
import morgan from "morgan";
import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";


const swaggerConfig = require('../src/config/swagger.config');
const theme = new SwaggerTheme();


require('dotenv').config();

let serverInstance;

const options = {
    explorer: true,
    customCss: theme.getBuffer(SwaggerThemeNameEnum.DARK)
  };

(async () => {
    const container = new Container();
    await container.loadAsync(bindings)

    const server = new InversifyExpressServer(container, null, {
        rootPath: "/v1",
    });

    server.setConfig((app) => {
        app.use(
            "/v1/api-docs",
            swaggerUi.serve,
            swaggerUi.setup(swaggerJSDoc(swaggerConfig.v1), options)
          );
        app.use(morgan("dev"));
        app.use(cors());
        app.use(
            bodyParser.urlencoded({
                extended: true,
            })
        );
        app.use(bodyParser.json());

        app.use(express.static(path.join(__dirname, "../public")));

        // Set BaseRouter usual for auth
        // app.use("/api", BaseRouter);
    })


    serverInstance = server.build();

    // constants
    const serverStartMsg = "Express server started on port: ",
        port = process.env.PORT || 3001;

    serverInstance.listen(port, () => {
        console.log(serverStartMsg + port);
    });
    
})();

export default serverInstance;