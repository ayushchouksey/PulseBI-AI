import express, { type Express }  from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";

import routes from "./routes/index.js";

import { requestId } from "./middleware/requestId.js";
import { requestLogger } from "./middleware/requestLogger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app: Express = express();

/*
|--------------------------------------------------------------------------
| Global Middleware
|--------------------------------------------------------------------------
*/

app.use(requestId);

app.use(requestLogger);

app.use(helmet());

app.use(cors());

app.use(compression());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/
app.get("/", (_req, res) => {

    res.json({

        application: "PulseBI AI",

        version: "1.0.0",

        status: "Running"

    });

});

app.use("/api/v1", routes);

/*
|--------------------------------------------------------------------------
| Error Middleware
|--------------------------------------------------------------------------
*/

app.use(notFoundHandler);

app.use(errorHandler);

export default app;