import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.use(morgan("dev"));
app.use(cors());

app.get("/", (_: Request, res: Response) => {
  res.send("Express + Typescript Server");
});

app.listen(port, () => {
  console.log(`🌼 Server is running at http://localhost:${port}`);
});
