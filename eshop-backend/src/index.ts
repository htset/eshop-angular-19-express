import express, { Application, Request, Response } from "express";
import { AppDataSource } from "./config/data-source";
import cors from "cors";
import routes from "./routes";

const app: Application = express();
const PORT = 3000;

//Middleware
app.use(express.json());
app.use(cors());
app.use(routes);

// Initialize the database and start the server
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
