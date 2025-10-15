import express, { urlencoded } from "express";
import { _dirname } from "../__dirname.js"
import mainRouter from "./routes/mainRoute.js";
import API_Router from "./routes/APIRoute.js";

const app = express();
app.use(urlencoded({extended:true}));
app.use(express.static(_dirname+'/public'));
app.use("/", mainRouter);
app.use("/api", API_Router);
export default app;