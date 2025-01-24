import express, { Application, Request, Response } from "express";

const app: Application = express();
const PORT = 3000;

//Middleware
app.use(express.json());

//Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the TypeScript Express server!");
});

//Start server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
